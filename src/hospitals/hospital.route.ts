import { Router } from "express";
import { listHospitals, getHospital, createHospital, updateHospital, deleteHospital } from "./hospital.controller";
import { validateRequest } from "@/middleware/validateRequest";
import { hospitalQuerySchema, createHospitalSchema, updateHospitalSchema } from "./hospital.validator";
import { requireRole } from "@/auth/auth.middleware";
import { authGuard } from "@/middleware/authGuard";

export const hospitalRouter = Router();

// Public
hospitalRouter.get("/", validateRequest(hospitalQuerySchema, "query"), listHospitals);
hospitalRouter.get("/:id", getHospital);

import { upload } from "@/utils/upload";

// Admin
hospitalRouter.post("/", authGuard, requireRole(["ADMIN"]), upload.array("images", 5), validateRequest(createHospitalSchema), createHospital);
hospitalRouter.put("/:id", authGuard, requireRole(["ADMIN"]), upload.array("images", 5), validateRequest(updateHospitalSchema), updateHospital);
hospitalRouter.delete("/:id", authGuard, requireRole(["ADMIN"]), deleteHospital);
