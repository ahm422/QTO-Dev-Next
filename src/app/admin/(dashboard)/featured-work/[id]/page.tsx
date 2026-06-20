import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import FeaturedWorkForm from "./FeaturedWorkForm"

export default async function FeaturedWorkFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Featured Work" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Featured Work", href: "/admin/featured-work" }, { label: "New" }]} />
        <FeaturedWorkForm />
      </div>
    )
  }

  const record = await prisma.featuredWork.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Featured Work" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Featured Work", href: "/admin/featured-work" }, { label: "Edit" }]} />
      <FeaturedWorkForm defaultValues={record} />
    </div>
  )
}
