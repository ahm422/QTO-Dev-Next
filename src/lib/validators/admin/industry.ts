import { z } from "zod"

export const industrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  bulletPoints: z.array(z.string()).default([]),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type IndustryInput = z.infer<typeof industrySchema>
