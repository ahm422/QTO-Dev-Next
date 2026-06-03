import { z } from "zod"

export const statSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  color: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type StatInput = z.infer<typeof statSchema>
