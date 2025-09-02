import { z } from "zod";

export const reminderUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  emailNotification: z.boolean().default(true),
  smsNotification: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
