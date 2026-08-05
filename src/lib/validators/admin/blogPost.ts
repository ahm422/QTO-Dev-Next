import { z } from "zod"
import { normalizeBlogCategory } from "@/config/blogCategories"

const MIN_EXCERPT = 80
const MIN_CONTENT_CHARS = 1200

export const blogPostSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    excerpt: z.string().optional().default(""),
    content: z.string().optional().default(""),
    category: z
      .string()
      .optional()
      .default("")
      .transform((val) => normalizeBlogCategory(val ?? "")),
    tags: z.array(z.string()).default([]),
    author: z.string().default("QTO DEV Team"),
    imageUrl: z.string().optional().default(""),
    imageAlt: z.string().optional().default(""),
    readTime: z
      .preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        z.coerce.number().int().positive().optional()
      )
      .transform((val) => (Number.isFinite(val) ? val : undefined)),
    publishedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
      .optional(),
    isFeatured: z.boolean().default(false),
    isHeadline: z.boolean().default(false),
    isPublished: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isPublished) return
    if (!data.category.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required when publishing",
        path: ["category"],
      })
    }
    if ((data.excerpt ?? "").trim().length < MIN_EXCERPT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Excerpt must be at least ${MIN_EXCERPT} characters when publishing`,
        path: ["excerpt"],
      })
    }
    const contentLen = (data.content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length
    if (contentLen < MIN_CONTENT_CHARS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Content must be at least ~${MIN_CONTENT_CHARS} characters of text when publishing (thin pages hurt SEO)`,
        path: ["content"],
      })
    }
  })

export type BlogPostInput = z.infer<typeof blogPostSchema>
