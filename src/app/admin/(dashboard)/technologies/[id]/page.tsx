import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TechnologyForm from "./TechnologyForm"

export default async function TechnologyFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Technology" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Technologies", href: "/admin/technologies" }, { label: "New" }]} />
        <TechnologyForm />
      </div>
    )
  }

  const record = await prisma.technology.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Technology" subtitle={record.name} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Technologies", href: "/admin/technologies" }, { label: "Edit" }]} />
      <TechnologyForm defaultValues={record} />
    </div>
  )
}
