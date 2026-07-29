import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import { Button } from "@/components/ui/button"
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
        subtitle="Advanced key-value editor. Prefer Site Settings for branding, contact, and social links."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Site Config" }]}
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Entry", href: "/admin/site-config/new" } : undefined}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/site-settings">Site Settings</Link>
          </Button>
        }
      />
      <SiteConfigTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
