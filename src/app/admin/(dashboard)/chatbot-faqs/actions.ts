"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { chatbotFaqSchema, type ChatbotFaqInput } from "@/lib/validators/admin/chatbotFaq"
import { persistOrderUpdates } from "@/lib/admin/reorder"

export async function createChatbotFaq(data: ChatbotFaqInput) {
  await requireCreateAction()
  await prisma.chatbotFaq.create({ data: chatbotFaqSchema.parse(data) })
  await persistD1Bookmark()
  return { success: true }
}

export async function updateChatbotFaq(id: string, data: ChatbotFaqInput) {
  await requireAdminAction()
  await prisma.chatbotFaq.update({ where: { id }, data: chatbotFaqSchema.parse(data) })
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteChatbotFaq(id: string) {
  await requireDeleteAction()
  await prisma.chatbotFaq.delete({ where: { id } })
  await persistD1Bookmark()
}

export async function toggleChatbotFaqPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.chatbotFaq.update({ where: { id }, data: { isPublished: value } })
  await persistD1Bookmark()
}

export async function reorderChatbotFaqs(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.chatbotFaq.update({ where: { id }, data: { order } })
  )
  await persistD1Bookmark()
}
