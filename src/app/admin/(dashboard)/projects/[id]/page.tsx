import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProjectForm from "./ProjectForm"

export default async function ProjectFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">New project</h2><ProjectForm /></div>
  const record = await prisma.project.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">Edit project</h2><ProjectForm defaultValues={record} /></div>
}
