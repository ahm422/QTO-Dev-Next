import { describe, expect, it } from "vitest"
import { contentFaqListSchema } from "@/lib/validators/admin/contentFaq"

describe("contentFaqListSchema", () => {
  it("accepts an empty list", () => {
    expect(contentFaqListSchema.parse([])).toEqual([])
  })

  it("drops a fully empty row, trims text, and preserves order", () => {
    const parsed = contentFaqListSchema.parse([
      { question: "  ", answer: "" },
      { question: " Second? ", answer: " Line two " },
      { question: "First?", answer: "Answer one" },
    ])
    expect(parsed).toEqual([
      { question: "Second?", answer: "Line two" },
      { question: "First?", answer: "Answer one" },
    ])
  })

  it("rejects a question without an answer", () => {
    const result = contentFaqListSchema.safeParse([{ question: "Why?", answer: "  " }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "0.answer")).toBe(true)
    }
  })

  it("rejects an answer without a question", () => {
    const result = contentFaqListSchema.safeParse([{ question: "", answer: "Because" }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "0.question")).toBe(true)
    }
  })

  it("rejects the 31st item", () => {
    const items = Array.from({ length: 31 }, (_, index) => ({
      question: `Question ${index + 1}`,
      answer: `Answer ${index + 1}`,
    }))
    expect(contentFaqListSchema.safeParse(items).success).toBe(false)
  })
})
