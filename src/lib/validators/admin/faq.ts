import { z } from "zod"

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  context: z.string().default("homepage"),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type FaqInput = z.infer<typeof faqSchema>
