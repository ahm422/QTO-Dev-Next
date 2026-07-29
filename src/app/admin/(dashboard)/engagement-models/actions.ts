"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { toPrismaEngagementModelData } from "@/lib/prisma/jsonModelData"
import { revalidatePath } from "next/cache"
import { engagementModelSchema, type EngagementModelInput } from "@/lib/validators/admin/engagementModel"
import { persistOrderUpdates } from "@/lib/admin/reorder"

export async function createEngagementModel(data: EngagementModelInput) {
  await requireCreateAction()
  await prisma.engagementModel.create({ data: toPrismaEngagementModelData(engagementModelSchema.parse(data)) })
  revalidatePath("/")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateEngagementModel(id: string, data: EngagementModelInput) {
  await requireAdminAction()
  await prisma.engagementModel.update({ where: { id }, data: toPrismaEngagementModelData(engagementModelSchema.parse(data)) })
  revalidatePath("/")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteEngagementModel(id: string) {
  await requireDeleteAction()
  await prisma.engagementModel.delete({ where: { id } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function toggleEngagementModelPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.engagementModel.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function reorderEngagementModels(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.engagementModel.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
  await persistD1Bookmark()
}
