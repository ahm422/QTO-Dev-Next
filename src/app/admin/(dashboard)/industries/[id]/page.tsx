import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fromPrismaIndustry } from "@/lib/prisma/jsonModelData"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import IndustryForm from "./IndustryForm"

export default async function IndustryFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Industry" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Industries", href: "/admin/industries" }, { label: "New" }]} />
        <IndustryForm />
      </div>
    )
  }

  const record = await prisma.industry.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Industry" subtitle={record.name} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Industries", href: "/admin/industries" }, { label: "Edit" }]} />
      <IndustryForm defaultValues={fromPrismaIndustry(record)} />
    </div>
  )
}
