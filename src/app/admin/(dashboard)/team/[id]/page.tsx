import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TeamMemberForm from "./TeamMemberForm"

export default async function TeamMemberFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Team Member" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Team", href: "/admin/team" }, { label: "New" }]} />
        <TeamMemberForm />
      </div>
    )
  }

  const record = await prisma.teamMember.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Team Member" subtitle={record.name} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Team", href: "/admin/team" }, { label: "Edit" }]} />
      <TeamMemberForm defaultValues={record} />
    </div>
  )
}
