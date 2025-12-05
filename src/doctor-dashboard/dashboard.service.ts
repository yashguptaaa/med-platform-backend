import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { toCamelCase, toSnakeCase } from "@/utils/transform";
import type { UpdateAvailabilityDto, ProfileChangeRequestDto } from "./dashboard.validator";

const getMyProfile = async (userId: string) => {
  console.log("userId:", userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      doctor: {
        include: {
          hospitals: { include: { hospital: true } },
          specializations: { include: { specialization: true } },
          availability: true,
          change_requests: {
            where: { status: "PENDING" },
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
  if (!user.doctor) throw new AppError("Doctor profile not found", StatusCodes.NOT_FOUND);

  const doctor = user.doctor;

  const mappedDoctor = {
    ...doctor,
    image: doctor.image || user.image,
    hospitals: doctor.hospitals.map((h) => h.hospital),
    specializations: doctor.specializations.map((s) => s.specialization),
    totalAppointments: await prisma.appointment.count({
      where: { doctor_id: doctor.id }
    }),
  };

  return toCamelCase(mappedDoctor);
};

const updateAvailability = async (userId: string, data: UpdateAvailabilityDto) => {
  const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } });
  if (!doctor) throw new AppError("Doctor profile not found", StatusCodes.NOT_FOUND);

  // Transaction to replace availability
  return prisma.$transaction(async (tx) => {
    // Delete existing
    await tx.availability.deleteMany({ where: { doctor_id: doctor.id } });
    
    // Create new
    // Create new
    if (data.availability.length > 0) {
      await tx.availability.createMany({
        data: data.availability.map((slot) => ({
          doctor_id: doctor.id,
          day_of_week: slot.dayOfWeek,
          start_time: slot.startTime,
          end_time: slot.endTime,
        })),
      });
    }

    const availability = await tx.availability.findMany({ where: { doctor_id: doctor.id } });
    return toCamelCase(availability);
  });
};

const requestProfileChange = async (userId: string, data: ProfileChangeRequestDto) => {
  const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } });
  if (!doctor) throw new AppError("Doctor profile not found", 404);

  // Check if there's already a pending request
  const pending = await prisma.doctorChangeRequest.findFirst({
    where: { doctor_id: doctor.id, status: "PENDING" },
  });

  if (pending) {
    // Update existing request
    const updated = await prisma.doctorChangeRequest.update({
      where: { id: pending.id },
      data: { requested_changes: toSnakeCase(data.changes) as any },
    });
    return toCamelCase(updated);
  }

  // Create new request
  const created = await prisma.doctorChangeRequest.create({
    data: {
      doctor_id: doctor.id,
      requested_changes: toSnakeCase(data.changes) as any,
      status: "PENDING",
    },
  });
  return toCamelCase(created);
};

export {
  getMyProfile,
  updateAvailability,
  requestProfileChange,
};
