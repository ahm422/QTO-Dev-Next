import { z } from "zod"

export const processStepSchema = z.object({
  context: z.string().min(1, "Context is required"),
  stepNumber: z.coerce.number().int().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional().default(""),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(false),
})

export type ProcessStepInput = z.infer<typeof processStepSchema>
