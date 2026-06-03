import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import StatForm from "./StatForm"

export default async function StatFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Stat" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Stats", href: "/admin/stats" }, { label: "New" }]} />
        <StatForm />
      </div>
    )
  }

  const record = await prisma.stat.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Stat" subtitle={record.label} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Stats", href: "/admin/stats" }, { label: "Edit" }]} />
      <StatForm defaultValues={record} />
    </div>
  )
}
