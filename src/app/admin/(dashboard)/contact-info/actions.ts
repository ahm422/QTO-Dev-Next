"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { contactInfoSchema, type ContactInfoInput } from "@/lib/validators/admin/contactInfo"
import { persistOrderUpdates } from "@/lib/admin/reorder"


export async function createContactInfo(data: ContactInfoInput) {
  await requireAdminAction()
  await prisma.contactInfo.create({ data: contactInfoSchema.parse(data) })
  revalidatePath("/contact")
  redirect("/admin/contact-info")
}

export async function updateContactInfo(id: string, data: ContactInfoInput) {
  await requireAdminAction()
  await prisma.contactInfo.update({ where: { id }, data: contactInfoSchema.parse(data) })
  revalidatePath("/contact")
  redirect("/admin/contact-info")
}

export async function deleteContactInfo(id: string) {
  await requireDeleteAction()
  await prisma.contactInfo.delete({ where: { id } })
  revalidatePath("/contact")
}

export async function toggleContactInfoPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.contactInfo.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/contact")
}

export async function reorderContactInfo(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.contactInfo.update({ where: { id }, data: { order } })
  )
  revalidatePath("/contact")
}
