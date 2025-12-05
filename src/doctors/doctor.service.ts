import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { toCamelCase } from "@/utils/transform";
import type {
  CreateDoctorDto,
  DoctorQueryDto,
  UpdateDoctorDto,
} from "./doctor.validator";
import { hashPassword } from "@/utils/password";
import { deleteFile } from "@/utils/upload";

const listDoctors = async (query: DoctorQueryDto) => {
  const { page = 1, limit = 10 } = query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = { deleted_at: null };
  if (query.city) {
    where.city = { contains: query.city, mode: "insensitive" };
  }
  if (query.hospitalId) {
    where.hospitals = { some: { hospital_id: query.hospitalId } };
  }
  if (query.specializationId) {
    where.specializations = {
      some: { specialization_id: query.specializationId },
    };
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
  if (query.sortBy === "experience") {
    orderBy.years_of_experience = query.order || "desc";
  } else if (query.sortBy === "rating") {
    orderBy.rating = query.order || "desc";
  } else {
    orderBy.name = "asc";
  }

  const [total, doctors] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where,
      include: {
        hospitals: { include: { hospital: true } },
        specializations: { include: { specialization: true } },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
  ]);

  const mappedDoctors = doctors.map((doctor: any) => ({
    ...doctor,
    hospitals: doctor.hospitals.map((h: any) => h.hospital),
    specializations: doctor.specializations.map((s: any) => s.specialization),
  }));

  return {
    data: toCamelCase(mappedDoctors),
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findFirst({
    where: { id, deleted_at: null },
    include: {
      hospitals: { include: { hospital: true } },
      specializations: { include: { specialization: true } },
      availability: true,
    },
  });
  if (!doctor) throw new AppError("Doctor not found", StatusCodes.NOT_FOUND);

  const mappedDoctor = {
    ...doctor,
    hospitals: doctor.hospitals.map((h: any) => h.hospital),
    specializations: doctor.specializations.map((s: any) => s.specialization),
  };

  return toCamelCase(mappedDoctor);
};

const createDoctor = async (data: CreateDoctorDto & { image?: string }) => {
  // 1. Check if user exists or create new one
  let user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
    const password_hash = await hashPassword("password123!");
    user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: password_hash,
        role: "DOCTOR",
      },
    });
  } else {
    // Optional: Ensure user has DOCTOR role?
    // For now, we assume if they exist, we just link them.
    // But if they are already linked to a doctor, this might fail (unique constraint on Doctor.userId).
    // Let's check if they are already a doctor
    const existingDoctor = await prisma.doctor.findUnique({ where: { user_id: user.id } });
    if (existingDoctor) {
      throw new AppError("User already has a doctor profile", StatusCodes.BAD_REQUEST);
    }
  }

  const doctor = await prisma.doctor.create({
    data: {
      name: data.name,
      city: data.city,
      years_of_experience: data.yearsOfExperience,
      rating: data.rating || 0,
      image: data.image,
      user_id: user.id, // Link to User
      hospitals: data.hospitalIds
        ? {
            create: data.hospitalIds.map((hospitalId) => ({
              hospital: { connect: { id: hospitalId } },
            })),
          }
        : undefined,
      specializations: data.specializationIds
        ? {
            create: data.specializationIds.map((specializationId) => ({
              specialization: { connect: { id: specializationId } },
            })),
          }
        : undefined,
    },
    include: {
      hospitals: { include: { hospital: true } },
      specializations: { include: { specialization: true } },
    },
  });

  const mappedDoctor = {
    ...doctor,
    hospitals: doctor.hospitals.map((h: any) => h.hospital),
    specializations: doctor.specializations.map((s: any) => s.specialization),
  };

  return toCamelCase(mappedDoctor);
};

const updateDoctor = async (id: string, data: UpdateDoctorDto & { image?: string }) => {
  const doctor = await prisma.doctor.findFirst({ where: { id, deleted_at: null } });
  if (!doctor) throw new AppError("Doctor not found", StatusCodes.NOT_FOUND);

  // If new image is provided and old image exists, delete old image
  if (data.image && doctor.image) {
    await deleteFile(doctor.image);
  }

  const updatedDoctor = await prisma.doctor.update({
    where: { id },
    data: {
      name: data.name,
      city: data.city,
      years_of_experience: data.yearsOfExperience,
      rating: data.rating,
      image: data.image,
      hospitals: data.hospitalIds
        ? {
            deleteMany: {},
            create: data.hospitalIds.map((hospitalId) => ({
              hospital: { connect: { id: hospitalId } },
            })),
          }
        : undefined,
      specializations: data.specializationIds
        ? {
            deleteMany: {},
            create: data.specializationIds.map((specializationId) => ({
              specialization: { connect: { id: specializationId } },
            })),
          }
        : undefined,
    },
    include: {
      hospitals: { include: { hospital: true } },
      specializations: { include: { specialization: true } },
    },
  });

  const mappedDoctor = {
    ...updatedDoctor,
    hospitals: updatedDoctor.hospitals.map((h: any) => h.hospital),
    specializations: updatedDoctor.specializations.map(
      (s: any) => s.specialization
    ),
  };

  return toCamelCase(mappedDoctor);
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findFirst({ where: { id, deleted_at: null } });
  if (!doctor) throw new AppError("Doctor not found", StatusCodes.NOT_FOUND);
  
  return prisma.doctor.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

const listChangeRequests = async () => {
  return prisma.doctorChangeRequest.findMany({
    where: { status: "PENDING" },
    include: { doctor: true },
    orderBy: { created_at: "asc" },
  });
};

const processChangeRequest = async (requestId: string, status: "APPROVED" | "REJECTED", feedback?: string) => {
  const request = await prisma.doctorChangeRequest.findUnique({
    where: { id: requestId },
    include: { doctor: true },
  });

  if (!request) throw new AppError("Request not found", StatusCodes.NOT_FOUND);
  if (request.status !== "PENDING") throw new AppError("Request already processed", StatusCodes.BAD_REQUEST);

  return prisma.$transaction(async (tx) => {
    // Update request status
    const updatedRequest = await tx.doctorChangeRequest.update({
      where: { id: requestId },
      data: { status, admin_feedback: feedback },
    });

    // If approved, apply changes to doctor profile
    if (status === "APPROVED") {
      const changes = request.requested_changes as any;
      // Filter out undefined/null values from changes to avoid overwriting with null if not intended
      // But here we assume changes contains only fields to update
      await tx.doctor.update({
        where: { id: request.doctor_id },
        data: {
          ...changes,
          // Ensure we don't accidentally change immutable fields if they were in JSON
          id: undefined,
          user_id: undefined,
          created_at: undefined,
          updated_at: undefined,
        },
      });
    }

    return updatedRequest;
  });
};

const getDoctorStats = async () => {
  const [totalDoctors, cities, avgRating] = await Promise.all([
    prisma.doctor.count({ where: { deleted_at: null } }),
    prisma.doctor.findMany({
      where: { deleted_at: null },
      select: { city: true },
      distinct: ["city"],
    }),
    prisma.doctor.aggregate({
      where: { deleted_at: null },
      _avg: { rating: true },
    }),
  ]);

  return {
    totalDoctors,
    totalCities: cities.length,
    averageRating: avgRating._avg.rating || 0,
  };
};

export {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  listChangeRequests,
  processChangeRequest,
  getDoctorStats,
};
