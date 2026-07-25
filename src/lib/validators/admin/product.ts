import { z } from "zod"

export const productFeatureSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  description: z.string().min(1, "Feature description is required"),
  icon: z.string().optional().default(""),
})

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  subtitle: z.string().optional().default(""),
  shortDescription: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  statusLabel: z.string().optional().default(""),
  titleHighlight: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  features: z.array(productFeatureSchema).default([]),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type ProductFeatureInput = z.infer<typeof productFeatureSchema>
export type ProductInput = z.infer<typeof productSchema>
