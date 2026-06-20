import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import FilterBar from "@/components/admin/data/FilterBar"
import BlogTable from "./Table"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const { q, status } = await searchParams
  const where = {
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(status === "published" ? { isPublished: true } : status === "draft" ? { isPublished: false } : {}),
  }

  const rows = await prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        subtitle="Manage blog posts and articles"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Blog" }]}
        primaryAction={{ label: "+ New Post", href: "/admin/blog/new" }}
      />
      <FilterBar searchPlaceholder="Search posts…" filters={[{ key: "status", placeholder: "All Statuses", options: [{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }] }]} />
      <BlogTable rows={rows} />
    </div>
  )
}
