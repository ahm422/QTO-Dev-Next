import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import IndustriesTable from "./Table"

export default async function IndustriesPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.industry.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Industries"
        subtitle="Industry verticals served by QTO"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Industries" }]}
        publicHref="/"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Industry", href: "/admin/industries/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[{ label: "Homepage → Industries", href: "/" }]}
        description="Renders the Industries We Serve grid on the homepage."
        component="IndustriesSection in src/app/(qtodev)/sections/IndustriesSection.tsx"
      />
      <IndustriesTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
