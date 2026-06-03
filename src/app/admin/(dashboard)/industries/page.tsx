import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import IndustriesTable from "./Table"

export default async function IndustriesPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.industry.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Industries"
        subtitle="Industry verticals served by QTO"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Industries" }]}
        primaryAction={{ label: "+ Add Industry", href: "/admin/industries/new" }}
      />
      <IndustriesTable rows={rows} />
    </div>
  )
}
