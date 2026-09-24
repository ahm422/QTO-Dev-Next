"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validators/admin/teamMember"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { revalidateTeamCaches } from "@/lib/revalidate"
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync"

async function enforceSingleFounder(excludeId?: string) {
  await prisma.teamMember.updateMany({
    where: excludeId ? { id: { not: excludeId }, isFounder: true } : { isFounder: true },
    data: { isFounder: false },
  })
}

export async function createTeamMember(data: TeamMemberInput) {
  await requireCreateAction()
  const parsed = teamMemberSchema.parse(data)
  if (parsed.isFounder) {
    await enforceSingleFounder()
  }
  await prisma.teamMember.create({ data: parsed })
  revalidateTeamCaches()
  triggerChatbotSync("team_members")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  await requireAdminAction()
  const parsed = teamMemberSchema.parse(data)
  if (parsed.isFounder) {
    await enforceSingleFounder(id)
  }
  await prisma.teamMember.update({ where: { id }, data: parsed })
  revalidateTeamCaches()
  triggerChatbotSync("team_members")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteTeamMember(id: string) {
  await requireDeleteAction()
  await prisma.teamMember.delete({ where: { id } })
  revalidateTeamCaches()
  triggerChatbotSync("team_members")
  await persistD1Bookmark()
}

export async function toggleTeamMemberPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.teamMember.update({ where: { id }, data: { isPublished: value } })
  revalidateTeamCaches()
  triggerChatbotSync("team_members")
  await persistD1Bookmark()
}

export async function reorderTeamMembers(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.teamMember.update({ where: { id }, data: { order } })
  )
  revalidateTeamCaches()
  triggerChatbotSync("team_members")
  await persistD1Bookmark()
}
