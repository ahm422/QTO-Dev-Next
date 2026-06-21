"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { faqSchema, type FaqInput } from "@/lib/validators/admin/faq"
import { persistOrderUpdates } from "@/lib/admin/reorder"


export async function createFaq(data: FaqInput) {
  await requireAdminAction()
  await prisma.faq.create({ data: faqSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/faqs")
}

export async function updateFaq(id: string, data: FaqInput) {
  await requireAdminAction()
  await prisma.faq.update({ where: { id }, data: faqSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/faqs")
}

export async function deleteFaq(id: string) {
  await requireDeleteAction()
  await prisma.faq.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleFaqPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.faq.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}

export async function reorderFaqs(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.faq.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}
