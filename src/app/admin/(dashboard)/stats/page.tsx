import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import StatsTable from "./Table"

export default async function StatsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.stat.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Stats"
        subtitle="Numerical highlights displayed on the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Stats" }]}
        publicHref="/"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Stat", href: "/admin/stats/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[{ label: "Homepage → Stats", href: "/" }]}
        description="Feeds the animated stats counter row on the homepage."
        component="StatsNumbersSection in src/app/(qtodev)/sections/StatsNumbersSection.tsx"
      />
      <StatsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
