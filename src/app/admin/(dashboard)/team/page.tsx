import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import TeamTable from "./Table"

export default async function TeamPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Team"
        subtitle="Team members and leadership"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Team" }]}
        publicHref="/about"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Member", href: "/admin/team/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[{ label: "About → Team", href: "/about" }]}
        description="Renders the Team Members grid on the About page."
        component="LeadershipSection in src/app/(qtodev)/about/sections/LeadershipSection.tsx"
      />
      <TeamTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
