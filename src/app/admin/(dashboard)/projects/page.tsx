import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ProjectsTable from "./Table"

export default async function ProjectsPage() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        subtitle="Portfolio and case study items"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projects" }]}
        primaryAction={{ label: "+ Add Project", href: "/admin/projects/new" }}
      />
      <ProjectsTable rows={rows} />
    </div>
  )
}
