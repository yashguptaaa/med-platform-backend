import { Router } from "express";
import { authGuard } from "@/middleware/authGuard";
import { requireRole } from "@/auth/auth.middleware";
import { validateRequest } from "@/middleware/validateRequest";
import { createAppointmentSchema, updateAppointmentStatusSchema } from "./appointment.validator";
import * as appointmentController from "./appointment.controller";

const appointmentRouter = Router();

// Create appointment (Any authenticated user)
appointmentRouter.post(
  "/",
  authGuard,
  validateRequest(createAppointmentSchema),
  appointmentController.createAppointment
);

// Get my appointments (Doctor or Patient)
appointmentRouter.get(
  "/me",
  authGuard,
  appointmentController.getMyAppointments
);

// Update status (Doctor only)
appointmentRouter.patch(
  "/:id/status",
  authGuard,
  requireRole(["DOCTOR"]),
  validateRequest(updateAppointmentStatusSchema),
  appointmentController.updateAppointmentStatus
);

// Get available slots
appointmentRouter.get(
  "/slots",
  // Public route - no auth required to check availability
  appointmentController.getSlots
);

export default appointmentRouter;
