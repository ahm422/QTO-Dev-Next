import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import StatCard from "@/components/admin/data/StatCard"
import StatCardGrid from "@/components/admin/data/StatCardGrid"
import FilterBar from "@/components/admin/data/FilterBar"
import StatisticsWidget from "@/components/admin/widgets/StatisticsWidget"
import TipsWidget from "@/components/admin/widgets/TipsWidget"
import ProcessStepsTable from "./Table"
import { GitBranch } from "lucide-react"

export default async function ProcessStepsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""

  const { q, status } = await searchParams

  const where = {
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(status === "published" ? { isPublished: true } : status === "draft" ? { isPublished: false } : {}),
  }

  const [rows, total, published, drafts] = await Promise.all([
    prisma.processStep.findMany({ where, orderBy: [{ context: "asc" }, { order: "asc" }] }),
    prisma.processStep.count(),
    prisma.processStep.count({ where: { isPublished: true } }),
    prisma.processStep.count({ where: { isPublished: false } }),
  ])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Process Steps"
        subtitle="Manage your workflow and methodology steps"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Process Steps" }]}
        publicHref="/"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Step", href: "/admin/process-steps/new" } : undefined}
      />

      <AdminContentContext
        publicPaths={[{ label: "Homepage → How We Work", href: "/" }]}
        description="Shown in the 'How We Work' process section on the homepage."
        component="HowWeWorkSection in src/app/(qtodev)/sections/HowWeWorkSection.tsx"
      />

      <StatCardGrid cols={3}>
        <StatCard label="Total Steps" value={total} icon={GitBranch} iconColor="purple" />
        <StatCard label="Published" value={published} icon={GitBranch} iconColor="success" badge="Live" badgeVariant="success" progress={(published / Math.max(1, total)) * 100} />
        <StatCard label="Drafts" value={drafts} icon={GitBranch} iconColor="warning" badge="Hidden" badgeVariant="warning" />
      </StatCardGrid>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        <div className="space-y-4">
          <FilterBar
            searchPlaceholder="Search steps…"
            filters={[
              {
                key: "status",
                placeholder: "All Statuses",
                options: [
                  { label: "Published", value: "published" },
                  { label: "Draft", value: "draft" },
                ],
              },
            ]}
          />
          <ProcessStepsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
        </div>

        <div className="space-y-4">
          <StatisticsWidget
            title="Progress"
            items={[
              { label: "Published", value: published, progress: (published / Math.max(1, total)) * 100, color: "success" },
              { label: "Drafts", value: drafts, progress: (drafts / Math.max(1, total)) * 100, color: "warning" },
              { label: "Total", value: total, progress: 100, color: "purple" },
            ]}
          />
          <TipsWidget
            tips={[
              "Keep step numbers sequential within each context",
              "Publish steps only when the description is complete",
              "Use context grouping to organise multi-phase workflows",
              "Drag handles let you reorder steps within a context",
            ]}
          />
        </div>
      </div>
    </div>
  )
}
