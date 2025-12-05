import { z } from "zod";

export const createAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  hospitalId: z.string().uuid(),
  date: z.string().datetime(), // ISO string
  reason: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const appointmentQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
}).passthrough();

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusDto = z.infer<typeof updateAppointmentStatusSchema>;
export type AppointmentQueryDto = z.infer<typeof appointmentQuerySchema>;
