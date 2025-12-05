import { z } from "zod";

export const hospitalQuerySchema = z.object({
  city: z.string().optional(),
  specializationId: z.string().optional(),
  specialization: z.string().optional(),
  sortBy: z.enum(["rating"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
}).passthrough();

export const createHospitalSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  googleMapLink: z.string().optional(),
  specializationIds: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).optional()),
  images: z.array(z.string()).optional(),
});

export const updateHospitalSchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  googleMapLink: z.string().optional(),
  specializationIds: z.preprocess((val) => {
    if (typeof val === "string") return [val];
    return val;
  }, z.array(z.string()).optional()),
});

export type HospitalQueryDto = z.infer<typeof hospitalQuerySchema>;
export type CreateHospitalDto = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalDto = z.infer<typeof updateHospitalSchema>;
