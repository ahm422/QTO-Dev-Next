import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TeamMemberForm from "./TeamMemberForm"

export default async function TeamMemberFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New team member</h2><TeamMemberForm /></div>
  const record = await prisma.teamMember.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit team member</h2><TeamMemberForm defaultValues={record} /></div>
}
