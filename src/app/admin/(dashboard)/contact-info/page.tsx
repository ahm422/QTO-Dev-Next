import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ContactInfoTable from "./Table"

export default async function ContactInfoPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.contactInfo.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Info"
        subtitle="Contact methods and office locations"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Contact Info" }]}
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Entry", href: "/admin/contact-info/new" } : undefined}
      />
      <ContactInfoTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
