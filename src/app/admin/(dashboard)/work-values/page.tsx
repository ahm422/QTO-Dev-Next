import { getServerSession } from "@/lib/auth/session"
import { roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import WorkValuesTable from "./Table"

export default async function WorkValuesPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.workValue.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Work Values"
        subtitle="Core values and culture items"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Work Values" }]}
        primaryAction={{ label: "+ Add Value", href: "/admin/work-values/new" }}
      />
      <WorkValuesTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
      />
    </div>
  )
}
