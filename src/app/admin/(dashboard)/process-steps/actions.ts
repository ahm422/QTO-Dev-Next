"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { processStepSchema, type ProcessStepInput } from "@/lib/validators/admin/processStep"
import { revalidatePaths } from "@/lib/revalidate"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync"

const PATHS = ["/", "/services"] as const


export async function createProcessStep(data: ProcessStepInput) {
  await requireCreateAction()
  await prisma.processStep.create({ data: processStepSchema.parse(data) })
  revalidatePaths([...PATHS])
  triggerChatbotSync("process_steps")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateProcessStep(id: string, data: ProcessStepInput) {
  await requireAdminAction()
  await prisma.processStep.update({ where: { id }, data: processStepSchema.parse(data) })
  revalidatePaths([...PATHS])
  triggerChatbotSync("process_steps")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteProcessStep(id: string) {
  await requireDeleteAction()
  await prisma.processStep.delete({ where: { id } })
  revalidatePaths([...PATHS])
  triggerChatbotSync("process_steps")
  await persistD1Bookmark()
}

export async function reorderProcessSteps(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.processStep.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
  triggerChatbotSync("process_steps")
  await persistD1Bookmark()
}

export async function toggleProcessStepPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.processStep.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
  triggerChatbotSync("process_steps")
  await persistD1Bookmark()
}
