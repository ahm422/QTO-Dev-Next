import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import JobsTable from "./Table"

export default async function JobsPage() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.job.findMany({ orderBy: { createdAt: "desc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Jobs"
        subtitle="Open positions and career listings"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Jobs" }]}
        primaryAction={{ label: "+ Add Job", href: "/admin/jobs/new" }}
      />
      <JobsTable rows={rows} />
    </div>
  )
}
