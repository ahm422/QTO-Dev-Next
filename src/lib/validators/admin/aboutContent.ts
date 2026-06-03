import { z } from "zod"

export const aboutContentSchema = z.object({
  section: z.string().min(1, "Section key is required"),
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  imageUrl: z.string(),
  order: z.number().int(),
})

export type AboutContentInput = z.infer<typeof aboutContentSchema>
