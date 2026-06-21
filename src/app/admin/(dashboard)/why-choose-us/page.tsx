import { getServerSession } from "@/lib/auth/session"
import { roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import WhyChooseUsTable from "./Table"

export default async function WhyChooseUsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.whyChooseUs.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Why Choose Us"
        subtitle="Reasons and differentiators shown on the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Why Choose Us" }]}
        primaryAction={{ label: "+ Add Item", href: "/admin/why-choose-us/new" }}
      />
      <WhyChooseUsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
      />
    </div>
  )
}
