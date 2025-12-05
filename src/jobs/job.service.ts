import { Prisma } from "@prisma/client";
import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import type {
  CreateJobDto,
  JobDto,
  JobListResponse,
  JobQueryDto,
  UpdateJobDto,
} from "./job.dto";
import { buildJobFilters, jobPagination } from "./job.helper";
import { serializeJob } from "./job.serializer";

const listJobs = async (query: JobQueryDto): Promise<any> => {
  const pagination = jobPagination(query);
  const where = { ...buildJobFilters(query), deleted_at: null };

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: pagination.skip,
      take: pagination.limit,
    }),
  ]);

  return {
    data: jobs.map(serializeJob),
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getJob = async (id: string): Promise<JobDto> => {
  const job = await prisma.job.findFirst({ where: { id, deleted_at: null } });
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return serializeJob(job);
};

const createJob = async (payload: CreateJobDto): Promise<JobDto> => {
  const job = await prisma.job.create({
    data: {
      title: payload.title,
      location: payload.location,
      description: payload.description,
      department: payload.department,
      is_active: payload.isActive ?? true,
    },
  });

  return serializeJob(job);
};

const updateJob = async (id: string, payload: UpdateJobDto): Promise<JobDto> => {
  const updateData: any = {};
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.location !== undefined) updateData.location = payload.location;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.department !== undefined) updateData.department = payload.department;
  if (payload.isActive !== undefined) updateData.is_active = payload.isActive;

  try {
    const job = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return serializeJob(job);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError("Job not found", StatusCodes.NOT_FOUND);
    }
    throw error;
  }
};

const deleteJob = async (id: string): Promise<JobDto> => {
  try {
    const job = await prisma.job.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return serializeJob(job);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError("Job not found", StatusCodes.NOT_FOUND);
    }
    throw error;
  }
};

export {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
