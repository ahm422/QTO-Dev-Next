import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import JobForm from "./JobForm"

export default async function JobFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Job" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Jobs", href: "/admin/jobs" }, { label: "New" }]} />
        <JobForm />
      </div>
    )
  }

  const record = await prisma.job.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Job" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Jobs", href: "/admin/jobs" }, { label: "Edit" }]} />
      <JobForm defaultValues={record} />
    </div>
  )
}
