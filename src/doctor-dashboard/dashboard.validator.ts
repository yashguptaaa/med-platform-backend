import { z } from "zod";

export const updateAvailabilitySchema = z.object({
  availability: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:mm
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:mm
  })),
});

export const profileChangeRequestSchema = z.object({
  changes: z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    about: z.string().optional(),
    // Add other fields as needed
  }),
});

export type UpdateAvailabilityDto = z.infer<typeof updateAvailabilitySchema>;
export type ProfileChangeRequestDto = z.infer<typeof profileChangeRequestSchema>;
