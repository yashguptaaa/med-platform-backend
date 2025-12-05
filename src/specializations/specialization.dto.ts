import { z } from "zod";

export const createSpecializationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
  }),
});

export const updateSpecializationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const specializationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  }).passthrough(),
});

export type CreateSpecializationDto = z.infer<typeof createSpecializationSchema>["body"];
export type UpdateSpecializationDto = z.infer<typeof updateSpecializationSchema>["body"];
export type SpecializationQueryDto = z.infer<typeof specializationQuerySchema>["query"];
