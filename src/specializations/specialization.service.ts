import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { toCamelCase } from "@/utils/transform";
import type { CreateSpecializationDto, SpecializationQueryDto, UpdateSpecializationDto } from "./specialization.dto";

const createSpecialization = async (data: CreateSpecializationDto) => {
  const existing = await prisma.specialization.findFirst({ where: { name: data.name, deleted_at: null } });
  if (existing) {
    throw new AppError("Specialization already exists", StatusCodes.CONFLICT);
  }
  const specialization = await prisma.specialization.create({ data });
  return toCamelCase(specialization);
};

const listSpecializations = async (query: SpecializationQueryDto) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  const where = { deleted_at: null };

  const [total, specializations] = await Promise.all([
    prisma.specialization.count({ where }),
    prisma.specialization.findMany({ 
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    data: toCamelCase(specializations),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateSpecialization = async (id: string, data: UpdateSpecializationDto) => {
  const existing = await prisma.specialization.findFirst({ where: { id, deleted_at: null } });
  if (!existing) {
    throw new AppError("Specialization not found", StatusCodes.NOT_FOUND);
  }
  const updated = await prisma.specialization.update({ where: { id }, data });
  return toCamelCase(updated);
};

const deleteSpecialization = async (id: string) => {
  const existing = await prisma.specialization.findFirst({ where: { id, deleted_at: null } });
  if (!existing) {
    throw new AppError("Specialization not found", 404);
  }
  return prisma.specialization.update({ 
    where: { id }, 
    data: { deleted_at: new Date() } 
  });
};

export {
  createSpecialization,
  listSpecializations,
  updateSpecialization,
  deleteSpecialization,
};
