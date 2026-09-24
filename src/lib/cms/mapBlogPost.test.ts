import { describe, expect, it } from "vitest"
import { mapBlogPost } from "@/lib/cms/mappers"
import type { BlogPostFaqSource } from "@/lib/prisma/blogPostData"

function makeRow(faqs?: BlogPostFaqSource["faqs"]): BlogPostFaqSource {
  return {
    id: "post-1",
    slug: "hello",
    title: "Hello",
    excerpt: "Excerpt",
    content: "Body",
    category: "News",
    author: "QTO DEV Team",
    imageUrl: null,
    imageAlt: null,
    readTime: 4,
    isFeatured: false,
    isHeadline: false,
    isPublished: true,
    publishedAt: new Date("2024-02-01T00:00:00.000Z"),
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-02-02T00:00:00.000Z"),
    tags: [],
    faqs,
  } as BlogPostFaqSource
}

describe("mapBlogPost FAQs", () => {
  it("returns FAQs in sortOrder", () => {
    const result = mapBlogPost(
      makeRow([
        { question: "Second?", answer: "B", sortOrder: 1 },
        { question: "First?", answer: "A", sortOrder: 0 },
      ])
    )
    expect(result.faqs).toEqual([
      { question: "First?", answer: "A" },
      { question: "Second?", answer: "B" },
    ])
  })

  it("returns an empty list when the relation is absent", () => {
    expect(mapBlogPost(makeRow()).faqs).toEqual([])
  })
})
