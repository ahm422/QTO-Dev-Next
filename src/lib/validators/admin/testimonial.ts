import { z } from "zod"

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientRole: z.string().optional().default(""),
  clientCompany: z.string().optional().default(""),
  quote: z.string().min(1, "Quote is required"),
  mediaType: z.enum(["none", "image", "video"]).default("none"),
  mediaUrl: z.string().optional().default(""),
  mediaAlt: z.string().optional().default(""),
  avatarUrl: z.string().optional().default(""),
  avatarColor: z.string().optional().default(""),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type TestimonialInput = z.infer<typeof testimonialSchema>
