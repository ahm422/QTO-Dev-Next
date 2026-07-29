import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fromPrismaBlogPost, blogPostWithTagsInclude } from "@/lib/prisma/blogPostData"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import FilterBar from "@/components/admin/data/FilterBar"
import { Suspense } from "react"
import { BLOG_NEWS_CATEGORY } from "@/config/blogCategories"
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

  const rows = await prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" }, include: blogPostWithTagsInclude })
  const publishedNewsCount = await prisma.blogPost.count({
    where: { isPublished: true, category: BLOG_NEWS_CATEGORY },
  })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        subtitle="Manage blog posts and articles"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Blog" }]}
        publicHref="/blogs"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ New Post", href: "/admin/blog/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[
          { label: "Blog listing", href: "/blogs" },
          { label: "News section", href: "/blogs" },
          { label: "Individual posts", href: "/blogs" },
        ]}
        description={`Published posts appear on /blogs and /blogs/[slug]. Category "${BLOG_NEWS_CATEGORY}" surfaces in the News section.`}
        component="Blog grid in src/app/(qtodev)/blogs/"
      />
      {publishedNewsCount === 0 ? (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
          No published &quot;{BLOG_NEWS_CATEGORY}&quot; posts — the News section on /blogs will show an empty state until you publish one with that category.
        </p>
      ) : null}
      <Suspense>
        <FilterBar searchPlaceholder="Search posts…" filters={[{ key: "status", placeholder: "All Statuses", options: [{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }] }]} />
      </Suspense>
      <BlogTable rows={rows.map(fromPrismaBlogPost)}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
