import { z } from "zod";

export const callBoxSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  buzzCode: z.string().min(1, "Buzz code is required"),
  isAutoOpen: z.boolean().default(false),
  accessCodes: z
    .array(
      z.object({
        code: z.string().min(1, "Access code is required"),
        user: z.string().min(1, "User is required"),
      })
    )
    .optional(),
});
