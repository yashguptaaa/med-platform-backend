import { Router } from "express";
import { create, list, update, remove } from "./specialization.controller";
import { requireRole } from "@/auth/auth.middleware";
import { authGuard } from "@/middleware/authGuard";
import { validateRequest } from "@/middleware/validateRequest";
import { createSpecializationSchema, updateSpecializationSchema } from "./specialization.dto";

export const specializationRouter = Router();

// Public
specializationRouter.get("/", list);

// Admin Only
specializationRouter.post("/", authGuard, requireRole(["ADMIN"]), validateRequest(createSpecializationSchema), create);
specializationRouter.put("/:id", authGuard, requireRole(["ADMIN"]), validateRequest(updateSpecializationSchema), update);
specializationRouter.delete("/:id", authGuard, requireRole(["ADMIN"]), remove);
