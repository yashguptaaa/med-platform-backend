import { z } from "zod";

export const doctorQuerySchema = z.object({
  hospitalId: z.string().optional(),
  specializationId: z.string().optional(),
  specialization: z.string().optional(),
  city: z.string().optional(),
  sortBy: z.enum(["rating", "experience"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
}).passthrough();

export const createDoctorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  city: z.string().min(1),
  yearsOfExperience: z.coerce.number().int().min(0),
  rating: z.coerce.number().min(0).max(5).optional(),
  hospitalIds: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).optional()),
  specializationIds: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).optional()),
});

export const updateDoctorSchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  yearsOfExperience: z.coerce.number().int().optional(),
  rating: z.coerce.number().optional(),
  hospitalIds: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).optional()),
  specializationIds: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).optional()),
});

export type DoctorQueryDto = z.infer<typeof doctorQuerySchema>;
export type CreateDoctorDto = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorDto = z.infer<typeof updateDoctorSchema>;
