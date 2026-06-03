import { z } from "zod"

export const featuredWorkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  link: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type FeaturedWorkInput = z.infer<typeof featuredWorkSchema>
