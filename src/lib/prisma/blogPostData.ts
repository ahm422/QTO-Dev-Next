import type { Prisma } from "@prisma/client";
import type { BlogPostInput } from "@/lib/validators/admin/blogPost";
import {
  createOrderedChildren,
  orderedTagValues,
  replaceOrderedChildren,
} from "@/lib/prisma/arrayFields";

const blogPostInclude = {
  tags: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.BlogPostInclude;

export const blogPostWithTagsInclude = blogPostInclude;

export type BlogPostWithTags = Prisma.BlogPostGetPayload<{
  include: typeof blogPostWithTagsInclude;
}>;

type BlogPostScalars = Omit<BlogPostInput, "tags" | "publishedAt">;

function toBlogPostScalars(input: BlogPostInput): BlogPostScalars {
  const { tags: _t, ...scalars } = input;
  return scalars;
}

export function toPrismaBlogPostCreateData(
  input: BlogPostInput
): Prisma.BlogPostCreateInput {
  const scalars = toBlogPostScalars(input);
  return {
    ...scalars,
    excerpt: scalars.excerpt || "",
    content: scalars.content || "",
    category: scalars.category || "",
    imageUrl: scalars.imageUrl || null,
    imageAlt: scalars.imageAlt || null,
    readTime: Number.isFinite(scalars.readTime) ? scalars.readTime : null,
    tags: createOrderedChildren(input.tags),
  };
}

export function toPrismaBlogPostUpdateData(
  input: BlogPostInput
): Prisma.BlogPostUpdateInput {
  const scalars = toBlogPostScalars(input);
  return {
    ...scalars,
    excerpt: scalars.excerpt || "",
    content: scalars.content || "",
    category: scalars.category || "",
    imageUrl: scalars.imageUrl || null,
    imageAlt: scalars.imageAlt || null,
    readTime: Number.isFinite(scalars.readTime) ? scalars.readTime : null,
    tags: replaceOrderedChildren(input.tags),
  };
}

export function toPrismaBlogPostPartialUpdateData(
  input: Partial<BlogPostInput>
): Prisma.BlogPostUpdateInput {
  const data: Prisma.BlogPostUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.excerpt !== undefined) data.excerpt = input.excerpt;
  if (input.content !== undefined) data.content = input.content;
  if (input.category !== undefined) data.category = input.category;
  if (input.author !== undefined) data.author = input.author;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl || null;
  if (input.imageAlt !== undefined) data.imageAlt = input.imageAlt || null;
  if (input.readTime !== undefined) {
    data.readTime = Number.isFinite(input.readTime) ? input.readTime : null;
  }
  if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
  if (input.isHeadline !== undefined) data.isHeadline = input.isHeadline;
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;
  if (input.tags !== undefined) data.tags = replaceOrderedChildren(input.tags);
  return data;
}

export function fromPrismaBlogPost(row: BlogPostWithTags) {
  const { tags: tagRows, imageUrl, imageAlt, readTime, publishedAt, ...rest } = row;
  return {
    ...rest,
    imageUrl: imageUrl ?? "",
    imageAlt: imageAlt ?? "",
    readTime: readTime ?? undefined,
    publishedAt: publishedAt?.toISOString().slice(0, 10) ?? undefined,
    tags: orderedTagValues(tagRows),
  };
}
