import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import FilterBar from "@/components/admin/data/FilterBar"
import BlogTable from "./Table"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""

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
        publicHref="/blog"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ New Post", href: "/admin/blog/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[
          { label: "Blog listing", href: "/blog" },
          { label: "Individual posts", href: "/blog" },
        ]}
        description="Each published post appears on /blog and at /blog/[slug]."
        component="Blog grid in src/app/(qtodev)/blogs/"
      />
      <FilterBar searchPlaceholder="Search posts…" filters={[{ key: "status", placeholder: "All Statuses", options: [{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }] }]} />
      <BlogTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
