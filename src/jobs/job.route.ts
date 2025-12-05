import { Router } from "express";
import { UserRole } from "@prisma/client";
import {
  createJob,
  deleteJob,
  getJobById,
  listJobs,
  updateJob,
} from "./job.controller";
import { validateRequest } from "@/middleware/validateRequest";
import {
  createJobSchema,
  jobIdParamSchema,
  jobQuerySchema,
  updateJobSchema,
} from "./job.validator";
import { authGuard } from "@/middleware/authGuard";
import { requireRole } from "@/auth/auth.middleware";

export const jobRouter = Router();

jobRouter.get("/", validateRequest(jobQuerySchema, "query"), listJobs);
jobRouter.get("/:id", validateRequest(jobIdParamSchema, "params"), getJobById);

jobRouter.post(
  "/",
  authGuard,
  requireRole([UserRole.ADMIN]),
  validateRequest(createJobSchema),
  createJob
);

jobRouter.patch(
  "/:id",
  authGuard,
  requireRole([UserRole.ADMIN]),
  validateRequest(jobIdParamSchema, "params"),
  validateRequest(updateJobSchema),
  updateJob
);

jobRouter.delete(
  "/:id",
  authGuard,
  requireRole([UserRole.ADMIN]),
  validateRequest(jobIdParamSchema, "params"),
  deleteJob
);

