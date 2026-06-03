import { z } from "zod"

export const engagementModelSchema = z.object({
  number: z.coerce.number().int().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).default([]),
  isMostPopular: z.boolean().default(false),
  ctaLabel: z.string().default("Get Started"),
  ctaLink: z.string().default("/contact"),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type EngagementModelInput = z.infer<typeof engagementModelSchema>
