import { describe, expect, it } from "vitest"
import { blogPostSchema } from "@/lib/validators/admin/blogPost"
import { serviceSchema } from "@/lib/validators/admin/service"
import {
  toPrismaBlogPostCreateData,
  toPrismaBlogPostPartialUpdateData,
  toPrismaBlogPostUpdateData,
} from "@/lib/prisma/blogPostData"
import {
  toPrismaServiceCreateData,
  toPrismaServicePartialUpdateData,
  toPrismaServiceUpdateData,
} from "@/lib/prisma/serviceData"

const blogInput = blogPostSchema.parse({
  title: "Hello",
  slug: "hello",
  faqs: [
    { question: "Second?", answer: "B" },
    { question: "First?", answer: "A" },
  ],
})

const serviceInput = serviceSchema.parse({
  title: "Web",
  slug: "web",
  shortDescription: "A short description that is long enough for a draft save.",
  faqs: [
    { question: "Second?", answer: "B" },
    { question: "First?", answer: "A" },
  ],
})

describe("blog and service FAQ mappers", () => {
  it("writes sortOrder from the array index and keeps faqs off scalar columns", () => {
    const blogCreate = toPrismaBlogPostCreateData(blogInput)
    const blogUpdate = toPrismaBlogPostUpdateData(blogInput)
    const serviceCreate = toPrismaServiceCreateData(serviceInput)
    const serviceUpdate = toPrismaServiceUpdateData(serviceInput)

    expect(blogCreate.faqs).toEqual({
      create: [
        { question: "Second?", answer: "B", sortOrder: 0 },
        { question: "First?", answer: "A", sortOrder: 1 },
      ],
    })
    expect(blogUpdate.faqs).toEqual({
      deleteMany: {},
      create: [
        { question: "Second?", answer: "B", sortOrder: 0 },
        { question: "First?", answer: "A", sortOrder: 1 },
      ],
    })
    expect(serviceCreate.faqs).toEqual(blogCreate.faqs)
    expect(serviceUpdate.faqs).toEqual(blogUpdate.faqs)
    expect(Array.isArray(blogCreate.faqs)).toBe(false)
    expect(Array.isArray(serviceCreate.faqs)).toBe(false)
    expect(blogCreate).not.toHaveProperty("question")
    expect(serviceCreate).not.toHaveProperty("question")
  })

  it("leaves the FAQ relation untouched when faqs is omitted and replaces it when faqs is an array", () => {
    expect(toPrismaBlogPostPartialUpdateData({ title: "Retitle" }).faqs).toBeUndefined()
    expect(toPrismaServicePartialUpdateData({ title: "Retitle" }).faqs).toBeUndefined()

    expect(toPrismaBlogPostPartialUpdateData({ faqs: [] }).faqs).toEqual({
      deleteMany: {},
      create: [],
    })
    expect(
      toPrismaServicePartialUpdateData({
        faqs: [{ question: "Q", answer: "A" }],
      }).faqs
    ).toEqual({
      deleteMany: {},
      create: [{ question: "Q", answer: "A", sortOrder: 0 }],
    })
  })
})
