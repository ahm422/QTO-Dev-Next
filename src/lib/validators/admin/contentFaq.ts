import { z } from "zod"

export const contentFaqItemSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(300),
  answer: z.string().trim().min(1, "Answer is required").max(4000),
})

export const contentFaqListSchema = z.preprocess(
  (val) =>
    Array.isArray(val)
      ? val.filter(
          (item) =>
            item &&
            (String(item.question ?? "").trim() || String(item.answer ?? "").trim())
        )
      : [],
  z.array(contentFaqItemSchema).max(30).default([])
)

export type ContentFaqItemInput = z.infer<typeof contentFaqItemSchema>
