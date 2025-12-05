import { Router } from "express";
import { authGuard } from "@/middleware/authGuard";
import { requireRole } from "@/auth/auth.middleware";
import { validateRequest } from "@/middleware/validateRequest";
import { updateAvailabilitySchema, profileChangeRequestSchema } from "./dashboard.validator";
import * as dashboardController from "./dashboard.controller";

const dashboardRouter = Router();

// All routes require DOCTOR role
dashboardRouter.use(authGuard, requireRole(["DOCTOR"]));

dashboardRouter.get("/me", dashboardController.getMyProfile);

dashboardRouter.put(
  "/availability",
  validateRequest(updateAvailabilitySchema),
  dashboardController.updateAvailability
);

dashboardRouter.post(
  "/profile-update-request",
  validateRequest(profileChangeRequestSchema),
  dashboardController.requestProfileChange
);

export default dashboardRouter;
