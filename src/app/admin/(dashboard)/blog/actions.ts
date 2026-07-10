"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { redirect } from "next/navigation"
import { blogPostSchema, type BlogPostInput } from "@/lib/validators/admin/blogPost"
import { revalidatePaths } from "@/lib/revalidate"
import { blogPaths } from "@/lib/revalidate-paths"
import {
  toPrismaBlogPostCreateData,
  toPrismaBlogPostUpdateData,
} from "@/lib/prisma/blogPostData"


export async function createBlogPost(data: BlogPostInput) {
  await requireCreateAction()
  const parsed = blogPostSchema.parse(data)
  const publishedAt = parsed.publishedAt
    ? new Date(parsed.publishedAt)
    : parsed.isPublished
      ? new Date()
      : null
  await prisma.blogPost.create({
    data: {
      ...toPrismaBlogPostCreateData(parsed),
      publishedAt,
    },
  })
  revalidatePaths([...blogPaths(parsed.slug)])
  await persistD1Bookmark()
  redirect("/admin/blog")
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  await requireAdminAction()
  const parsed = blogPostSchema.parse(data)
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { isPublished: true, publishedAt: true } })
  const publishedAt = parsed.publishedAt
    ? new Date(parsed.publishedAt)
    : parsed.isPublished && !existing?.publishedAt
      ? new Date()
      : existing?.publishedAt ?? null
  await prisma.blogPost.update({
    where: { id },
    data: {
      ...toPrismaBlogPostUpdateData(parsed),
      publishedAt,
    },
  })
  revalidatePaths([...blogPaths(parsed.slug)])
  await persistD1Bookmark()
  redirect("/admin/blog")
}

export async function deleteBlogPost(id: string) {
  await requireDeleteAction()
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } })
  await prisma.blogPost.delete({ where: { id } })
  revalidatePaths([...blogPaths(post?.slug)])
  await persistD1Bookmark()
}

export async function toggleBlogPostPublished(id: string, value: boolean) {
  await requireAdminAction()
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true, slug: true } })
  const publishedAt = value && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null
  await prisma.blogPost.update({ where: { id }, data: { isPublished: value, publishedAt } })
  revalidatePaths([...blogPaths(existing?.slug)])
  await persistD1Bookmark()
}
