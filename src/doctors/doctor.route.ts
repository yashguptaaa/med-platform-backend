import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  listDoctors,
  updateDoctor,
  listChangeRequests,
  processChangeRequest,
  getDoctorStats,
} from "./doctor.controller";
import { validateRequest } from "@/middleware/validateRequest";
import { doctorQuerySchema, createDoctorSchema, updateDoctorSchema } from "./doctor.validator";
import { requireRole } from "@/auth/auth.middleware";
import { authGuard } from "@/middleware/authGuard";

export const doctorRouter = Router();

// Admin
import { upload } from "@/utils/upload";
doctorRouter.post("/", authGuard, requireRole(["ADMIN"]), upload.single("image"), validateRequest(createDoctorSchema), createDoctor);
doctorRouter.get("/requests", authGuard, requireRole(["ADMIN"]), listChangeRequests);
doctorRouter.post("/requests/:id/process", authGuard, requireRole(["ADMIN"]), processChangeRequest);

// Public
doctorRouter.get("/", validateRequest(doctorQuerySchema, "query"), listDoctors);
doctorRouter.get("/stats", getDoctorStats);
doctorRouter.get("/:id", getDoctor);

doctorRouter.put("/:id", authGuard, requireRole(["ADMIN"]), upload.single("image"), validateRequest(updateDoctorSchema), updateDoctor);
doctorRouter.delete("/:id", authGuard, requireRole(["ADMIN"]), deleteDoctor);
