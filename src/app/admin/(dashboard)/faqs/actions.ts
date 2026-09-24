"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { revalidatePath } from "next/cache"
import { faqSchema, type FaqInput } from "@/lib/validators/admin/faq"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync"


export async function createFaq(data: FaqInput) {
  await requireCreateAction()
  await prisma.faq.create({ data: faqSchema.parse(data) })
  revalidatePath("/")
  triggerChatbotSync("faqs")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateFaq(id: string, data: FaqInput) {
  await requireAdminAction()
  await prisma.faq.update({ where: { id }, data: faqSchema.parse(data) })
  revalidatePath("/")
  triggerChatbotSync("faqs")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteFaq(id: string) {
  await requireDeleteAction()
  await prisma.faq.delete({ where: { id } })
  revalidatePath("/")
  triggerChatbotSync("faqs")
  await persistD1Bookmark()
}

export async function toggleFaqPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.faq.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  triggerChatbotSync("faqs")
  await persistD1Bookmark()
}

export async function reorderFaqs(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.faq.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
  triggerChatbotSync("faqs")
  await persistD1Bookmark()
}
