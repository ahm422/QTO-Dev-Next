import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import SiteConfigTable from "./Table"

export default async function SiteConfigPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const rows = await prisma.siteConfig.findMany({ orderBy: { key: "asc" } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Config"
        subtitle="Global site configuration key-value settings"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Site Config" }]}
        primaryAction={{ label: "+ Add Entry", href: "/admin/site-config/new" }}
      />
      <SiteConfigTable rows={rows} />
    </div>
  )
}
