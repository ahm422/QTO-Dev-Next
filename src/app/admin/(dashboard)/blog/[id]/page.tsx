import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BlogPostForm from "./BlogPostForm"

export default async function BlogPostFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">New blog post</h2><BlogPostForm /></div>
  const record = await prisma.blogPost.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">Edit blog post</h2><BlogPostForm defaultValues={record} /></div>
}
