import { z } from "zod";

export const adminSendEmailSchema = z.object({
  to: z
    .string()
    .trim()
    .min(1, "Recipient email is required")
    .email("Recipient must be a valid email address"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or fewer"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(10000, "Message must be 10,000 characters or fewer"),
  recipientName: z.string().trim().max(200).optional().nullable(),
});

export type AdminSendEmailInput = z.infer<typeof adminSendEmailSchema>;
