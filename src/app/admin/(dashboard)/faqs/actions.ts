"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { faqSchema, type FaqInput } from "@/lib/validators/admin/faq"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createFaq(data: FaqInput) {
  await requireAdmin()
  await prisma.faq.create({ data: faqSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/faqs")
}

export async function updateFaq(id: string, data: FaqInput) {
  await requireAdmin()
  await prisma.faq.update({ where: { id }, data: faqSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/faqs")
}

export async function deleteFaq(id: string) {
  await requireAdmin()
  await prisma.faq.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleFaqPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.faq.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
