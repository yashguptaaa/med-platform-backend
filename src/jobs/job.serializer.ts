import type { Job } from "@prisma/client";
import type { JobDto } from "./job.dto";

const serializeJob = (job: any): JobDto => ({
  id: job.id,
  title: job.title,
  location: job.location,
  description: job.description,
  department: job.department,
  isActive: job.is_active,
  createdAt: job.created_at,
  updatedAt: job.updated_at,
});

export {
  serializeJob,
};
