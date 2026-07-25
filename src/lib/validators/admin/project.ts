import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  client: z.string().optional().default(""),
  category: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  excerpt: z.string().optional().default(""),
  description: z.string().optional().default(""),
  challenge: z.string().optional().default(""),
  solution: z.string().optional().default(""),
  results: z.array(z.string()).default([]),
  coverImageUrl: z.string().optional().default(""),
  images: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().optional().default(""),
  serviceSlug: z.string().optional().default(""),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
  completedAt: z.string().optional().nullable(),
})

export type ProjectInput = z.infer<typeof projectSchema>
