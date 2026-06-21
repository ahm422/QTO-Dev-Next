"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { engagementModelSchema, type EngagementModelInput } from "@/lib/validators/admin/engagementModel"
import { persistOrderUpdates } from "@/lib/admin/reorder"


export async function createEngagementModel(data: EngagementModelInput) {
  await requireAdminAction()
  await prisma.engagementModel.create({ data: engagementModelSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/engagement-models")
}

export async function updateEngagementModel(id: string, data: EngagementModelInput) {
  await requireAdminAction()
  await prisma.engagementModel.update({ where: { id }, data: engagementModelSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/engagement-models")
}

export async function deleteEngagementModel(id: string) {
  await requireDeleteAction()
  await prisma.engagementModel.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleEngagementModelPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.engagementModel.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}

export async function reorderEngagementModels(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.engagementModel.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}
