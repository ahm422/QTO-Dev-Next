import { z } from "zod"

export const contactInfoSchema = z.object({
  type: z.string().min(1, "Type is required"),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  subLabel: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type ContactInfoInput = z.infer<typeof contactInfoSchema>
