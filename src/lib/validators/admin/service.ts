import { z } from "zod"

export const serviceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    shortDescription: z.string().min(1, "Short description is required"),
    description: z.string().optional().default(""),
    icon: z.string().optional().default(""),
    features: z.array(z.string()).default([]),
    technologyTags: z.array(z.string()).default([]),
    imageUrl: z.string().optional().default(""),
    imageAlt: z.string().optional().default(""),
    order: z.coerce.number().int().default(0),
    isPublished: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isPublished) return
    if (data.shortDescription.trim().length < 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Short description must be at least 80 characters when publishing",
        path: ["shortDescription"],
      })
    }
  })

export type ServiceInput = z.infer<typeof serviceSchema>
