"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { redirect } from "next/navigation"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validators/admin/teamMember"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { revalidatePaths } from "@/lib/revalidate"

const PATHS = ["/", "/about"] as const


export async function createTeamMember(data: TeamMemberInput) {
  await requireCreateAction()
  await prisma.teamMember.create({ data: teamMemberSchema.parse(data) })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
  redirect("/admin/team")
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  await requireAdminAction()
  await prisma.teamMember.update({ where: { id }, data: teamMemberSchema.parse(data) })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
  redirect("/admin/team")
}

export async function deleteTeamMember(id: string) {
  await requireDeleteAction()
  await prisma.teamMember.delete({ where: { id } })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
}

export async function toggleTeamMemberPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.teamMember.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
}

export async function reorderTeamMembers(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.teamMember.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
}
