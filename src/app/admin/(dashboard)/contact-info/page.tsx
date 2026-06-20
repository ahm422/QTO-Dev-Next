import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ContactInfoTable from "./Table"

export default async function ContactInfoPage() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.contactInfo.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Info"
        subtitle="Contact methods and office locations"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Contact Info" }]}
        primaryAction={{ label: "+ Add Entry", href: "/admin/contact-info/new" }}
      />
      <ContactInfoTable rows={rows} />
    </div>
  )
}
