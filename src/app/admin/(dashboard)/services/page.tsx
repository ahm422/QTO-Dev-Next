import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import StatCard from "@/components/admin/data/StatCard"
import StatCardGrid from "@/components/admin/data/StatCardGrid"
import FilterBar from "@/components/admin/data/FilterBar"
import ServicesTable from "./Table"
import { Briefcase } from "lucide-react"

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const { q, status } = await searchParams

  const where = {
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    ...(status === "published" ? { isPublished: true } : status === "draft" ? { isPublished: false } : {}),
  }

  const [rows, total, published, drafts] = await Promise.all([
    prisma.service.findMany({ where, orderBy: { order: "asc" } }),
    prisma.service.count(),
    prisma.service.count({ where: { isPublished: true } }),
    prisma.service.count({ where: { isPublished: false } }),
  ])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services"
        subtitle="Manage your service offerings"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Services" }]}
        primaryAction={{ label: "+ Add Service", href: "/admin/services/new" }}
      />

      <StatCardGrid cols={4}>
        <StatCard label="Total Services" value={total} icon={Briefcase} iconColor="primary" />
        <StatCard label="Published" value={published} icon={Briefcase} iconColor="success" badge="Live" badgeVariant="success" progress={(published / Math.max(1, total)) * 100} />
        <StatCard label="Drafts" value={drafts} icon={Briefcase} iconColor="warning" badge="Hidden" badgeVariant="warning" />
        <StatCard label="Publish Rate" value={`${Math.round((published / Math.max(1, total)) * 100)}%`} iconColor="blue" progress={(published / Math.max(1, total)) * 100} />
      </StatCardGrid>

      <FilterBar
        searchPlaceholder="Search services…"
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

      <ServicesTable rows={rows} />
    </div>
  )
}
