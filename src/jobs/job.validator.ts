import { z } from "zod";

const booleanString = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((value) => value === true || value === "true");

export const jobQuerySchema = z.object({
  department: z.string().optional(),
  location: z.string().optional(),
  isActive: booleanString.optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const jobIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createJobSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(2),
  description: z.string().min(10),
  department: z.string().min(2),
  isActive: z.boolean().optional().default(true),
});

export const updateJobSchema = createJobSchema.partial();

