import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminNavItems } from "@/config/admin-nav"

const STAT_SECTIONS = [
  { label: "Services",          href: "/admin/services",          count: () => prisma.service.count(),         published: () => prisma.service.count({ where: { isPublished: true } }) },
  { label: "Process Steps",     href: "/admin/process-steps",     count: () => prisma.processStep.count(),     published: () => prisma.processStep.count({ where: { isPublished: true } }) },
  { label: "Featured Work",     href: "/admin/featured-work",     count: () => prisma.featuredWork.count(),    published: () => prisma.featuredWork.count({ where: { isPublished: true } }) },
  { label: "Why Choose Us",     href: "/admin/why-choose-us",     count: () => prisma.whyChooseUs.count(),     published: () => prisma.whyChooseUs.count({ where: { isPublished: true } }) },
  { label: "Stats",             href: "/admin/stats",             count: () => prisma.stat.count(),            published: () => prisma.stat.count({ where: { isPublished: true } }) },
  { label: "Testimonials",      href: "/admin/testimonials",      count: () => prisma.testimonial.count(),     published: () => prisma.testimonial.count({ where: { isPublished: true } }) },
  { label: "Industries",        href: "/admin/industries",        count: () => prisma.industry.count(),        published: () => prisma.industry.count({ where: { isPublished: true } }) },
  { label: "Engagement Models", href: "/admin/engagement-models", count: () => prisma.engagementModel.count(), published: () => prisma.engagementModel.count({ where: { isPublished: true } }) },
  { label: "FAQs",              href: "/admin/faqs",              count: () => prisma.faq.count(),             published: () => prisma.faq.count({ where: { isPublished: true } }) },
  { label: "Blog",              href: "/admin/blog",              count: () => prisma.blogPost.count(),        published: () => prisma.blogPost.count({ where: { isPublished: true } }) },
  { label: "Technologies",      href: "/admin/technologies",      count: () => prisma.technology.count(),      published: () => prisma.technology.count({ where: { isPublished: true } }) },
  { label: "Projects",          href: "/admin/projects",          count: () => prisma.project.count(),         published: () => prisma.project.count({ where: { isPublished: true } }) },
  { label: "Work Values",       href: "/admin/work-values",       count: () => prisma.workValue.count(),       published: () => prisma.workValue.count({ where: { isPublished: true } }) },
  { label: "Team",              href: "/admin/team",              count: () => prisma.teamMember.count(),      published: () => prisma.teamMember.count({ where: { isPublished: true } }) },
  { label: "Jobs",              href: "/admin/jobs",              count: () => prisma.job.count(),             published: () => prisma.job.count({ where: { isPublished: true } }) },
  { label: "Contact Info",      href: "/admin/contact-info",      count: () => prisma.contactInfo.count(),     published: () => prisma.contactInfo.count({ where: { isPublished: true } }) },
]

export default async function AdminDashboardPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const counts = await Promise.all(
    STAT_SECTIONS.map(async (s) => {
      const [total, published] = await Promise.all([s.count(), s.published()])
      return { label: s.label, href: s.href, total, published }
    })
  )

  const quickLinks = adminNavItems.filter((item) => item.href !== "/admin")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Content overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {counts.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="hover:bg-accent/40 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{s.total}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.published} published
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Link href="/admin/about">
          <Card className="hover:bg-accent/40 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mt-1">Key-value sections</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/site-config">
          <Card className="hover:bg-accent/40 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Site Config</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mt-1">Global settings</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium mb-3">Quick links</p>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={`${item.href}/new`}
              className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              + {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
