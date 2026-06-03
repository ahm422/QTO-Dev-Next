"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validators/admin/teamMember"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createTeamMember(data: TeamMemberInput) {
  await requireAdmin()
  await prisma.teamMember.create({ data: teamMemberSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/team")
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  await requireAdmin()
  await prisma.teamMember.update({ where: { id }, data: teamMemberSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/team")
}

export async function deleteTeamMember(id: string) {
  await requireAdmin()
  await prisma.teamMember.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleTeamMemberPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.teamMember.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
