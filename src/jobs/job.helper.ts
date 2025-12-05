import { Prisma } from "@prisma/client";
import type { JobQueryDto } from "./job.dto";
import { parsePaginationParams } from "@/utils/pagination";

const buildJobFilters = (query: JobQueryDto): Prisma.JobWhereInput => {
  const where: Prisma.JobWhereInput = {};

  if (query.department) {
    where.department = { contains: query.department, mode: "insensitive" };
  }

  if (query.location) {
    where.location = { contains: query.location, mode: "insensitive" };
  }

  if (typeof query.isActive === "boolean") {
    where.is_active = query.isActive;
  }

  return where;
};

const jobPagination = (query: JobQueryDto) =>
  parsePaginationParams(query.page?.toString(), query.limit?.toString(), 20);

export {
  buildJobFilters,
  jobPagination,
};
