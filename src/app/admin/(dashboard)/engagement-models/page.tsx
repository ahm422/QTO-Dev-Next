import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import EngagementModelsTable from "./Table"

export default async function EngagementModelsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.engagementModel.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Engagement Models"
        subtitle="How clients can work with QTO"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Engagement Models" }]}
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Model", href: "/admin/engagement-models/new" } : undefined}
      />
      <EngagementModelsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
