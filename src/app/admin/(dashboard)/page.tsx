import Link from "next/link"
import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import DashboardStatsCards from "@/components/admin/data/DashboardStatsCards"
import AdminPageSection from "@/components/admin/layout/AdminPageSection"
import ActivityFeed, { type ActivityItem } from "@/components/admin/data/ActivityFeed"
import ContentActivityChart, { type ActivityDataPoint } from "@/components/admin/charts/ContentActivityChart"
import ContentStatusDonut, { type DonutDataPoint } from "@/components/admin/charts/ContentStatusDonut"
import WidgetCard from "@/components/admin/widgets/WidgetCard"
import { getDashboardStats } from "@/lib/admin/dashboardStats"
import {
  Briefcase, GitBranch, BookOpen, FolderKanban, Cpu,
  Users, FileText, LayoutGrid, BarChart2,
} from "lucide-react"

async function getActivityFeedItems(): Promise<ActivityItem[]> {
  const [services, blog, projects, team] = await Promise.all([
    prisma.service.findMany({ orderBy: { updatedAt: "desc" }, take: 4, select: { id: true, title: true, updatedAt: true } }),
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take: 4, select: { id: true, title: true, updatedAt: true } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, title: true, updatedAt: true } }),
    prisma.teamMember.findMany({ orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, name: true, updatedAt: true } }),
  ])

  const items: ActivityItem[] = [
    ...services.map((r) => ({ id: `svc-${r.id}`, label: r.title, section: "Services", action: "updated" as const, updatedAt: r.updatedAt })),
    ...blog.map((r) => ({ id: `blog-${r.id}`, label: r.title, section: "Blog", action: "updated" as const, updatedAt: r.updatedAt })),
    ...projects.map((r) => ({ id: `proj-${r.id}`, label: r.title, section: "Projects", action: "updated" as const, updatedAt: r.updatedAt })),
    ...team.map((r) => ({ id: `team-${r.id}`, label: r.name, section: "Team", action: "updated" as const, updatedAt: r.updatedAt })),
  ]

  return items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 10)
}

const QUICK_ACTIONS = [
  { label: "New Service",      href: "/admin/services/new",          icon: Briefcase },
  { label: "New Blog Post",    href: "/admin/blog/new",               icon: BookOpen },
  { label: "New Project",      href: "/admin/projects/new",           icon: FolderKanban },
  { label: "New Team Member",  href: "/admin/team/new",               icon: Users },
  { label: "New Process Step", href: "/admin/process-steps/new",      icon: GitBranch },
  { label: "New Technology",   href: "/admin/technologies/new",       icon: Cpu },
]

export default async function AdminDashboardPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")

  const [stats, activityItems, currentUser] = await Promise.all([
    getDashboardStats(),
    getActivityFeedItems(),
    prisma.adminUser.findUnique({ where: { id: session!.user.id }, select: { email: true, displayName: true } }),
  ])

  const donutData: DonutDataPoint[] = stats.sections
    .filter((s) => s.color)
    .map((s) => ({ label: s.label, value: s.count ?? 0, color: s.color as string }))

  const chartData: ActivityDataPoint[] = stats.activityChart.points

  const welcomeName = currentUser ? (currentUser.displayName ?? currentUser.email.split("@")[0]) : ""
  const greeting = welcomeName ? `Welcome back, ${welcomeName}` : "Welcome back"
  const subtitle = `${greeting}. Here's what's happening with your content.`

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Dashboard Overview" subtitle={subtitle} />

      {/* Top stat cards (client-fetched from /api/admin/dashboard/stats) */}
      <DashboardStatsCards />

      {/* Second row: chart + quick actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <AdminPageSection title="Content Activity" icon={BarChart2} className="lg:col-span-2">
          <ContentActivityChart data={chartData} />
        </AdminPageSection>

        <WidgetCard title="Quick Actions">
          <div className="space-y-1.5">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors group"
              >
                <div className="h-7 w-7 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 group-hover:text-primary" />
                </div>
                {label}
              </Link>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Third row: activity feed + donut chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <AdminPageSection title="Recent Activity" icon={FileText} className="lg:col-span-2">
          <ActivityFeed items={activityItems} />
        </AdminPageSection>

        <AdminPageSection title="Content Breakdown" icon={LayoutGrid}>
          <ContentStatusDonut data={donutData} centerLabel="Items" />
        </AdminPageSection>
      </div>

      {/* All sections grid */}
      <AdminPageSection title="All Content Sections">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {stats.sections.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="flex flex-col items-start gap-1 rounded-lg border border-border bg-muted/30 hover:bg-accent hover:border-border/80 px-3 py-3 transition-colors group"
            >
              <span className="text-xs font-medium text-foreground group-hover:text-primary truncate w-full">{s.label}</span>
              {s.count !== null ? (
                <span className="text-lg font-bold text-muted-foreground tabular-nums">{s.count}</span>
              ) : (
                <span className="text-xs text-muted-foreground/60">Settings</span>
              )}
            </Link>
          ))}
        </div>
      </AdminPageSection>
    </div>
  )
}
