"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { blogPostSchema, type BlogPostInput } from "@/lib/validators/admin/blogPost"
import { revalidatePaths } from "@/lib/revalidate"
import { blogPaths } from "@/lib/revalidate-paths"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createBlogPost(data: BlogPostInput) {
  await requireAdmin()
  const parsed = blogPostSchema.parse(data)
  await prisma.blogPost.create({
    data: {
      ...parsed,
      publishedAt: parsed.isPublished ? new Date() : null,
    },
  })
  revalidatePaths([...blogPaths(parsed.slug)])
  redirect("/admin/blog")
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  await requireAdmin()
  const parsed = blogPostSchema.parse(data)
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { isPublished: true, publishedAt: true } })
  const publishedAt = parsed.isPublished && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null
  await prisma.blogPost.update({
    where: { id },
    data: { ...parsed, publishedAt },
  })
  revalidatePaths([...blogPaths(parsed.slug)])
  redirect("/admin/blog")
}

export async function deleteBlogPost(id: string) {
  await requireAdmin()
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } })
  await prisma.blogPost.delete({ where: { id } })
  revalidatePaths([...blogPaths(post?.slug)])
}

export async function toggleBlogPostPublished(id: string, value: boolean) {
  await requireAdmin()
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true, slug: true } })
  const publishedAt = value && !existing?.publishedAt ? new Date() : existing?.publishedAt ?? null
  await prisma.blogPost.update({ where: { id }, data: { isPublished: value, publishedAt } })
  revalidatePaths([...blogPaths(existing?.slug)])
}
