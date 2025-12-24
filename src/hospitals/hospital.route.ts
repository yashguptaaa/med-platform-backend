import { Router } from "express";
import { listHospitals, getHospital, createHospital, updateHospital, deleteHospital, getNearbyHospitals } from "./hospital.controller";
import { validateRequest } from "@/middleware/validateRequest";
import { hospitalQuerySchema, createHospitalSchema, updateHospitalSchema } from "./hospital.validator";
import { requireRole } from "@/auth/auth.middleware";
import { authGuard } from "@/middleware/authGuard";
import { upload } from "@/utils/upload";

export const hospitalRouter = Router();

// Public
hospitalRouter.get("/nearby", getNearbyHospitals);
hospitalRouter.get("/", validateRequest(hospitalQuerySchema, "query"), listHospitals);
hospitalRouter.get("/:id", getHospital);

// Admin
hospitalRouter.post("/", authGuard, requireRole(["ADMIN"]), upload.array("images", 5), validateRequest(createHospitalSchema), createHospital);
hospitalRouter.put("/:id", authGuard, requireRole(["ADMIN"]), upload.array("images", 5), validateRequest(updateHospitalSchema), updateHospital);
hospitalRouter.delete("/:id", authGuard, requireRole(["ADMIN"]), deleteHospital);
