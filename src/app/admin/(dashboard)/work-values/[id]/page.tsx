import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import WorkValueForm from "./WorkValueForm"

export default async function WorkValueFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Work Value" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Work Values", href: "/admin/work-values" }, { label: "New" }]} />
        <WorkValueForm />
      </div>
    )
  }

  const record = await prisma.workValue.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Work Value" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Work Values", href: "/admin/work-values" }, { label: "Edit" }]} />
      <WorkValueForm defaultValues={record} />
    </div>
  )
}
