import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import StatCard from "@/components/admin/data/StatCard"
import StatCardGrid from "@/components/admin/data/StatCardGrid"
import AdminPageSection from "@/components/admin/layout/AdminPageSection"
import ActivityFeed, { type ActivityItem } from "@/components/admin/data/ActivityFeed"
import ContentActivityChart, { type ActivityDataPoint } from "@/components/admin/charts/ContentActivityChart"
import ContentStatusDonut from "@/components/admin/charts/ContentStatusDonut"
import WidgetCard from "@/components/admin/widgets/WidgetCard"
import {
  Briefcase, GitBranch, BookOpen, FolderKanban, Cpu,
  Users, MessageSquare, HelpCircle, Layers, BarChart2,
  Activity, FileText, LayoutGrid,
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

function buildActivityChartData(): ActivityDataPoint[] {
  // Static representative data for visual purposes (no real time-series in current schema)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const monthIdx = (now.getMonth() - 11 + i + 12) % 12
    return {
      month: months[monthIdx],
      services: Math.floor(Math.random() * 4) + 1,
      blog: Math.floor(Math.random() * 6) + 1,
      projects: Math.floor(Math.random() * 3) + 1,
    }
  })
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
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const [
    servicesTotal, servicesPublished,
    processStepsTotal, processStepsPublished,
    blogTotal, blogPublished,
    projectsTotal, projectsPublished,
    teamTotal,
    testimonialTotal,
    techTotal,
    faqTotal,
    industryTotal,
    engagementTotal,
    activityItems,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { isPublished: true } }),
    prisma.processStep.count(),
    prisma.processStep.count({ where: { isPublished: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.teamMember.count(),
    prisma.testimonial.count(),
    prisma.technology.count(),
    prisma.faq.count(),
    prisma.industry.count(),
    prisma.engagementModel.count(),
    getActivityFeedItems(),
  ])

  const totalContent = servicesTotal + processStepsTotal + blogTotal + projectsTotal + teamTotal + testimonialTotal + techTotal + faqTotal + industryTotal + engagementTotal
  const totalPublished = servicesPublished + processStepsPublished + blogPublished + projectsPublished
  const healthPct = totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0

  const donutData = [
    { label: "Services",      value: servicesTotal,      color: "#F97316" },
    { label: "Blog",          value: blogTotal,          color: "#3B82F6" },
    { label: "Projects",      value: projectsTotal,      color: "#A855F7" },
    { label: "Process Steps", value: processStepsTotal,  color: "#06B6D4" },
    { label: "Team",          value: teamTotal,          color: "#22C55E" },
  ]

  const chartData = buildActivityChartData()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle={`Welcome back${session?.user?.name ? `, ${session.user.name}` : ""}. Here's what's happening with your content.`}
      />

      {/* Top stat cards */}
      <StatCardGrid cols={5}>
        <StatCard label="Total Services" value={servicesTotal} icon={Briefcase} badge={`${servicesPublished} live`} badgeVariant="success" progress={(servicesPublished / Math.max(1, servicesTotal)) * 100} iconColor="primary" />
        <StatCard label="Process Steps" value={processStepsTotal} icon={GitBranch} badge={`${processStepsPublished} live`} badgeVariant="success" iconColor="blue" />
        <StatCard label="Blog Posts" value={blogTotal} icon={BookOpen} badge={`${blogPublished} live`} badgeVariant="info" progress={(blogPublished / Math.max(1, blogTotal)) * 100} iconColor="purple" />
        <StatCard label="Projects" value={projectsTotal} icon={FolderKanban} badge={`${projectsPublished} live`} badgeVariant="info" iconColor="teal" />
        <StatCard label="Content Health" value={`${healthPct}%`} icon={Activity} badge={healthPct >= 70 ? "Good" : "Needs attention"} badgeVariant={healthPct >= 70 ? "success" : "warning"} progress={healthPct} iconColor="success" />
      </StatCardGrid>

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
          {[
            { label: "Services",          href: "/admin/services",          count: servicesTotal },
            { label: "Process Steps",     href: "/admin/process-steps",     count: processStepsTotal },
            { label: "Blog",              href: "/admin/blog",              count: blogTotal },
            { label: "Projects",          href: "/admin/projects",          count: projectsTotal },
            { label: "Team",              href: "/admin/team",              count: teamTotal },
            { label: "Testimonials",      href: "/admin/testimonials",      count: testimonialTotal },
            { label: "Technologies",      href: "/admin/technologies",      count: techTotal },
            { label: "FAQs",              href: "/admin/faqs",              count: faqTotal },
            { label: "Industries",        href: "/admin/industries",        count: industryTotal },
            { label: "Eng. Models",       href: "/admin/engagement-models", count: engagementTotal },
            { label: "Featured Work",     href: "/admin/featured-work",     count: 0 },
            { label: "Why Choose Us",     href: "/admin/why-choose-us",     count: 0 },
            { label: "Stats",             href: "/admin/stats",             count: 0 },
            { label: "Work Values",       href: "/admin/work-values",       count: 0 },
            { label: "Jobs",              href: "/admin/jobs",              count: 0 },
            { label: "Contact Info",      href: "/admin/contact-info",      count: 0 },
            { label: "About",             href: "/admin/about",             count: null },
            { label: "Site Config",       href: "/admin/site-config",       count: null },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col items-start gap-1 rounded-lg border border-border bg-muted/30 hover:bg-accent hover:border-border/80 px-3 py-3 transition-colors group"
            >
              <span className="text-xs font-medium text-foreground group-hover:text-primary truncate w-full">{s.label}</span>
              {s.count !== null && (
                <span className="text-lg font-bold text-muted-foreground tabular-nums">{s.count}</span>
              )}
              {s.count === null && (
                <span className="text-xs text-muted-foreground/60">Settings</span>
              )}
            </Link>
          ))}
        </div>
      </AdminPageSection>
    </div>
  )
}
