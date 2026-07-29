import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import { AlertTriangle } from "lucide-react"
import TeamTable from "./Table"

export default async function TeamPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  const hasPublishedFounder = rows.some((r) => r.isFounder && r.isPublished)

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
        publicPaths={[
          { label: "About → CEO", href: "/about" },
          { label: "About → Team", href: "/about" },
        ]}
        description="Founder + published + avatar drive the CEO section; other published members appear in the Team Members grid. Without a published founder the site uses static CEO fallback content."
        component="CeoSection + LeadershipSection in src/app/(qtodev)/about/sections/"
      />
      {!hasPublishedFounder ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-[var(--admin-warning)]/30 bg-[var(--admin-warning)]/10 px-4 py-3 text-sm text-foreground"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--admin-warning)]" aria-hidden />
          <div>
            <p className="font-medium">No published founder</p>
            <p className="mt-0.5 text-muted-foreground">
              The About and homepage CEO section will use static fallback content until one team member has Founder, Published, and a valid Avatar.
            </p>
          </div>
        </div>
      ) : null}
      <TeamTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
