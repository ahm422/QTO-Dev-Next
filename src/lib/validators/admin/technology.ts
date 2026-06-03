import { z } from "zod"

export const technologySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  iconKey: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type TechnologyInput = z.infer<typeof technologySchema>
