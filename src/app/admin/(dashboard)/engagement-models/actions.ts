"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { engagementModelSchema, type EngagementModelInput } from "@/lib/validators/admin/engagementModel"
import { persistOrderUpdates } from "@/lib/admin/reorder"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createEngagementModel(data: EngagementModelInput) {
  await requireAdmin()
  await prisma.engagementModel.create({ data: engagementModelSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/engagement-models")
}

export async function updateEngagementModel(id: string, data: EngagementModelInput) {
  await requireAdmin()
  await prisma.engagementModel.update({ where: { id }, data: engagementModelSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/engagement-models")
}

export async function deleteEngagementModel(id: string) {
  await requireAdmin()
  await prisma.engagementModel.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleEngagementModelPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.engagementModel.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}

export async function reorderEngagementModels(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.engagementModel.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}
