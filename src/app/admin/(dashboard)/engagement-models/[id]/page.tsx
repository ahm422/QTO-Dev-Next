import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fromPrismaEngagementModel } from "@/lib/prisma/jsonModelData"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import EngagementModelForm from "./EngagementModelForm"

export default async function EngagementModelFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Engagement Model" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Engagement Models", href: "/admin/engagement-models" }, { label: "New" }]} />
        <EngagementModelForm />
      </div>
    )
  }

  const record = await prisma.engagementModel.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Engagement Model" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Engagement Models", href: "/admin/engagement-models" }, { label: "Edit" }]} />
      <EngagementModelForm defaultValues={fromPrismaEngagementModel(record)} />
    </div>
  )
}
