import { z } from "zod"

export const chatbotFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().default("general"),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type ChatbotFaqInput = z.infer<typeof chatbotFaqSchema>
