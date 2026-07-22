import Link from "next/link"
import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import DashboardStatsCards from "@/components/admin/data/DashboardStatsCards"
import AllContentSectionsGrid from "@/components/admin/data/AllContentSectionsGrid"
import AdminPageSection from "@/components/admin/layout/AdminPageSection"
import RecentActivityCard from "@/components/admin/data/RecentActivityCard"
import ContentActivityChart from "@/components/admin/charts/ContentActivityChart"
import ContentStatusDonut, { type DonutDataPoint } from "@/components/admin/charts/ContentStatusDonut"
import WidgetCard from "@/components/admin/widgets/WidgetCard"
import { getDashboardStats } from "@/lib/admin/dashboardStats"
import {
  Briefcase, GitBranch, BookOpen, FolderKanban, Cpu,
  Users, FileText, LayoutGrid, BarChart2,
} from "lucide-react"

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

  const [stats, currentUser] = await Promise.all([
    getDashboardStats(),
    prisma.adminUser.findUnique({ where: { id: session!.user.id }, select: { email: true, displayName: true } }),
  ])

  const donutData: DonutDataPoint[] = stats.sections
    .filter((s) => s.color)
    .map((s) => ({ label: s.label, value: s.count ?? 0, color: s.color as string }))

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
          <ContentActivityChart />
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
          <RecentActivityCard limit={10} />
        </AdminPageSection>

        <AdminPageSection title="Content Breakdown" icon={LayoutGrid}>
          <ContentStatusDonut data={donutData} centerLabel="Items" />
        </AdminPageSection>
      </div>

      {/* All sections grid (client-fetched from /api/admin/dashboard/stats) */}
      <AdminPageSection title="All Content Sections" icon={LayoutGrid}>
        <AllContentSectionsGrid />
      </AdminPageSection>
    </div>
  )
}
