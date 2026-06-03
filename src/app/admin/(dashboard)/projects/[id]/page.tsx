import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ProjectForm from "./ProjectForm"

export default async function ProjectFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Project" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projects", href: "/admin/projects" }, { label: "New" }]} />
        <ProjectForm />
      </div>
    )
  }

  const record = await prisma.project.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Project" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Projects", href: "/admin/projects" }, { label: "Edit" }]} />
      <ProjectForm defaultValues={record} />
    </div>
  )
}
