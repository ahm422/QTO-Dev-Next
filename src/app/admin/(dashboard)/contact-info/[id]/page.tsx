import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ContactInfoForm from "./ContactInfoForm"

export default async function ContactInfoFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Contact Entry" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Contact Info", href: "/admin/contact-info" }, { label: "New" }]} />
        <ContactInfoForm />
      </div>
    )
  }

  const record = await prisma.contactInfo.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Contact Entry" subtitle={record.label} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Contact Info", href: "/admin/contact-info" }, { label: "Edit" }]} />
      <ContactInfoForm defaultValues={record} />
    </div>
  )
}
