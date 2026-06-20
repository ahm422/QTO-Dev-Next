import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TeamTable from "./Table"

export default async function TeamPage() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Team"
        subtitle="Team members and leadership"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Team" }]}
        primaryAction={{ label: "+ Add Member", href: "/admin/team/new" }}
      />
      <TeamTable rows={rows} />
    </div>
  )
}
