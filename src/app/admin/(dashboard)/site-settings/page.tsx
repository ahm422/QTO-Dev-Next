import Link from "next/link"
import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { siteSettingsFromRows } from "@/lib/validators/admin/siteSettings"
import SiteSettingsForm from "./SiteSettingsForm"

export default async function SiteSettingsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) {
    redirect("/admin/unauthorized")
  }

  const rows = await prisma.siteConfig.findMany()
  const defaultValues = siteSettingsFromRows(rows)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Settings"
        subtitle="These values power the public footer and site branding. They are CMS-managed, not env vars."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Site Settings" },
        ]}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/site-config">Advanced key-value editor</Link>
          </Button>
        }
      />
      <SiteSettingsForm defaultValues={defaultValues} />
    </div>
  )
}
