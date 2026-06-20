"use server"

import { getServerSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { contactInfoSchema, type ContactInfoInput } from "@/lib/validators/admin/contactInfo"
import { persistOrderUpdates } from "@/lib/admin/reorder"

async function requireAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createContactInfo(data: ContactInfoInput) {
  await requireAdmin()
  await prisma.contactInfo.create({ data: contactInfoSchema.parse(data) })
  revalidatePath("/contact")
  redirect("/admin/contact-info")
}

export async function updateContactInfo(id: string, data: ContactInfoInput) {
  await requireAdmin()
  await prisma.contactInfo.update({ where: { id }, data: contactInfoSchema.parse(data) })
  revalidatePath("/contact")
  redirect("/admin/contact-info")
}

export async function deleteContactInfo(id: string) {
  await requireAdmin()
  await prisma.contactInfo.delete({ where: { id } })
  revalidatePath("/contact")
}

export async function toggleContactInfoPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.contactInfo.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/contact")
}

export async function reorderContactInfo(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.contactInfo.update({ where: { id }, data: { order } })
  )
  revalidatePath("/contact")
}
