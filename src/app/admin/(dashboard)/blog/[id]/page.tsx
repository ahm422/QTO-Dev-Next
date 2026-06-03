import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import BlogPostForm from "./BlogPostForm"

export default async function BlogPostFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Blog Post" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Blog", href: "/admin/blog" }, { label: "New" }]} />
        <BlogPostForm />
      </div>
    )
  }

  const record = await prisma.blogPost.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Blog Post" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Blog", href: "/admin/blog" }, { label: "Edit" }]} />
      <BlogPostForm defaultValues={record} />
    </div>
  )
}
