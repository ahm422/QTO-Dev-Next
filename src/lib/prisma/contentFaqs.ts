import type { ContentFaqItemInput } from "@/lib/validators/admin/contentFaq"

export type ContentFaqRow = {
  question: string
  answer: string
  sortOrder: number
}

function toFaqCreate(items: ContentFaqItemInput[]) {
  return items.map((item, sortOrder) => ({
    question: item.question,
    answer: item.answer,
    sortOrder,
  }))
}

export function createContentFaqs(items: ContentFaqItemInput[]) {
  return { create: toFaqCreate(items) }
}

export function replaceContentFaqs(items: ContentFaqItemInput[]) {
  return {
    deleteMany: {},
    create: toFaqCreate(items),
  }
}

/** Drop `faqs` unless the raw PATCH body actually sent the key. */
export function faqsFromRawBody<T extends { faqs?: unknown }>(body: unknown, data: T): T {
  if (body && typeof body === "object" && Object.prototype.hasOwnProperty.call(body, "faqs")) {
    return data
  }
  if (!("faqs" in data)) return data
  const { faqs: _faqs, ...rest } = data
  return rest as T
}

export function mapContentFaqRows(rows: ContentFaqRow[] | null | undefined) {
  return [...(rows ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ question, answer }) => ({ question, answer }))
}
