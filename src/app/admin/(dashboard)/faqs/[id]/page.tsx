import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import FaqForm from "./FaqForm"

export default async function FaqFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New FAQ" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "FAQs", href: "/admin/faqs" }, { label: "New" }]} />
        <FaqForm />
      </div>
    )
  }

  const record = await prisma.faq.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit FAQ" subtitle={record.question} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "FAQs", href: "/admin/faqs" }, { label: "Edit" }]} />
      <FaqForm defaultValues={record} />
    </div>
  )
}
