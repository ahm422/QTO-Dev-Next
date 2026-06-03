"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validators/admin/teamMember"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { revalidatePaths } from "@/lib/revalidate"

const PATHS = ["/", "/about"] as const

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createTeamMember(data: TeamMemberInput) {
  await requireAdmin()
  await prisma.teamMember.create({ data: teamMemberSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/team")
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  await requireAdmin()
  await prisma.teamMember.update({ where: { id }, data: teamMemberSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/team")
}

export async function deleteTeamMember(id: string) {
  await requireAdmin()
  await prisma.teamMember.delete({ where: { id } })
  revalidatePaths([...PATHS])
}

export async function toggleTeamMemberPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.teamMember.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
}

export async function reorderTeamMembers(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.teamMember.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
}
