import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { fromPrismaProject, projectWithRelationsInclude } from "@/lib/prisma/projectData"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ProjectForm from "./ProjectForm"

export default async function ProjectFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Project" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projects", href: "/admin/projects" }, { label: "New" }]} />
        <ProjectForm />
      </div>
    )
  }

  const record = await prisma.project.findUnique({ where: { id }, include: projectWithRelationsInclude })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Project" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projects", href: "/admin/projects" }, { label: "Edit" }]} />
      <ProjectForm defaultValues={fromPrismaProject(record)} />
    </div>
  )
}
