import { getServerSession } from "@/lib/auth/session"
import { roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TechnologiesTable from "./Table"

export default async function TechnologiesPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.technology.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Technologies"
        subtitle="Tech stack and tools showcased on the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Technologies" }]}
        primaryAction={{ label: "+ Add Technology", href: "/admin/technologies/new" }}
      />
      <TechnologiesTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
      />
    </div>
  )
}
