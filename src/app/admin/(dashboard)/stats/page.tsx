import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import StatsTable from "./Table"

export default async function StatsPage() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.stat.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Stats"
        subtitle="Numerical highlights displayed on the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Stats" }]}
        primaryAction={{ label: "+ Add Stat", href: "/admin/stats/new" }}
      />
      <StatsTable rows={rows} />
    </div>
  )
}
