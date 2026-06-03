import { z } from "zod"

export const aboutContentSchema = z.object({
  section: z.string().min(1, "Section key is required"),
  title: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  body: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
})

export type AboutContentInput = z.infer<typeof aboutContentSchema>
