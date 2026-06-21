import { getServerSession } from "@/lib/auth/session"
import { roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import SiteConfigTable from "./Table"

export default async function SiteConfigPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""

  const rows = await prisma.siteConfig.findMany({ orderBy: { key: "asc" } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Config"
        subtitle="Global site configuration key-value settings"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Site Config" }]}
        primaryAction={{ label: "+ Add Entry", href: "/admin/site-config/new" }}
      />
      <SiteConfigTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
      />
    </div>
  )
}
