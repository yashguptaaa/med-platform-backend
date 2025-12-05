import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { toCamelCase } from "@/utils/transform";
import type { CreateHospitalDto, HospitalQueryDto, UpdateHospitalDto } from "./hospital.validator";
import { deleteFile } from "@/utils/upload";

const listHospitals = async (query: HospitalQueryDto) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const where: any = { deleted_at: null };
  if (query.city) {
    where.city = { contains: query.city, mode: "insensitive" };
  }
  if (query.specializationId) {
    where.specializations = { some: { specialization_id: query.specializationId } };
  }
  if (query.specialization) {
    where.specializations = {
      some: { 
        specialization: {
          name: { contains: query.specialization, mode: "insensitive" }
        }
      },
    };
  }

  const orderBy: any = {};
  if (query.sortBy === "rating") {
    orderBy.rating = query.order || "desc";
  } else {
    orderBy.name = "asc";
  }

  const [total, hospitals] = await Promise.all([
    prisma.hospital.count({ where }),
    prisma.hospital.findMany({
      where,
      include: { specializations: { include: { specialization: true } } },
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  const mappedHospitals = hospitals.map((hospital) => ({
    ...hospital,
    specializations: hospital.specializations.map((s) => s.specialization),
  }));

  return {
    data: toCamelCase(mappedHospitals),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getHospital = async (id: string) => {
  const hospital = await prisma.hospital.findFirst({
    where: { id, deleted_at: null },
    include: { 
      specializations: { include: { specialization: true } }, 
      doctors: { 
        include: { 
          doctor: {
            include: {
              specializations: { include: { specialization: true } }
            }
          }
        } 
      } 
    },
  });
  if (!hospital) throw new AppError("Hospital not found", StatusCodes.NOT_FOUND);
  
  const mappedHospital = {
    ...hospital,
    specializations: hospital.specializations.map((s) => s.specialization),
    doctors: hospital.doctors.map((d) => ({
      ...d.doctor,
      specializations: d.doctor.specializations.map((s) => s.specialization),
    })),
  };

  return toCamelCase(mappedHospital);
};

const createHospital = async (data: CreateHospitalDto) => {
  const hospital = await prisma.hospital.create({
    data: {
      name: data.name,
      city: data.city,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      google_map_link: data.googleMapLink,
      specializations: data.specializationIds
        ? { create: data.specializationIds.map((specializationId) => ({ specialization: { connect: { id: specializationId } } })) }
        : undefined,
      images: data.images || [],
    },
    include: { specializations: { include: { specialization: true } } },
  });

  const mappedHospital = {
    ...hospital,
    specializations: hospital.specializations.map((s) => s.specialization),
  };

  return toCamelCase(mappedHospital);
};

const updateHospital = async (id: string, data: UpdateHospitalDto & { images?: string[] }) => {
  const hospital = await prisma.hospital.findFirst({ where: { id, deleted_at: null } });
  if (!hospital) throw new AppError("Hospital not found", StatusCodes.NOT_FOUND);

  // If new images are provided and not empty, delete old images
  if (data.images && data.images.length > 0 && hospital.images.length > 0) {
    await Promise.all(hospital.images.map((img) => deleteFile(img)));
  }

  const updatedHospital = await prisma.hospital.update({
    where: { id },
    data: {
      name: data.name,
      city: data.city,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      google_map_link: data.googleMapLink,
      images: data.images && data.images.length > 0 ? data.images : undefined,
      specializations: data.specializationIds
        ? { 
            deleteMany: {},
            create: data.specializationIds.map((specializationId) => ({ specialization: { connect: { id: specializationId } } })) 
          }
        : undefined,
    },
    include: { specializations: { include: { specialization: true } } },
  });

  const mappedHospital = {
    ...updatedHospital,
    specializations: updatedHospital.specializations.map((s) => s.specialization),
  };

  return toCamelCase(mappedHospital);
};

const deleteHospital = async (id: string) => {
  const hospital = await prisma.hospital.findFirst({ where: { id, deleted_at: null } });
  if (!hospital) throw new AppError("Hospital not found", StatusCodes.NOT_FOUND);
  
  return prisma.hospital.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export {
  listHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
};
