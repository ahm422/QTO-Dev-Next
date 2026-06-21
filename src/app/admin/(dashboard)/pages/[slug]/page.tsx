import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import PageSectionForm from "./PageSectionForm"

export default async function PageSectionEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  if (decodedSlug === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="New Page Section"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Pages", href: "/admin/pages" }, { label: "New" }]}
        />
        <PageSectionForm />
      </div>
    )
  }

  const record = await prisma.pageSection.findUnique({ where: { slug: decodedSlug } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Page Section"
        subtitle={record.label ?? record.slug}
        badges={[{ label: record.isPublished ? "Live" : "Hidden", variant: record.isPublished ? "success" : "warning" }]}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Pages", href: "/admin/pages" },
          { label: record.label ?? record.slug },
        ]}
      />
      <PageSectionForm defaultValues={record} />
    </div>
  )
}
