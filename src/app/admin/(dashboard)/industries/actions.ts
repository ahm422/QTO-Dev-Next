"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { toPrismaIndustryData } from "@/lib/prisma/jsonModelData"
import { revalidatePath } from "next/cache"
import { industrySchema, type IndustryInput } from "@/lib/validators/admin/industry"
import { persistOrderUpdates } from "@/lib/admin/reorder"

export async function createIndustry(data: IndustryInput) {
  await requireCreateAction()
  await prisma.industry.create({ data: toPrismaIndustryData(industrySchema.parse(data)) })
  revalidatePath("/")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateIndustry(id: string, data: IndustryInput) {
  await requireAdminAction()
  const parsed = industrySchema.parse(data)
  await prisma.industry.update({ where: { id }, data: toPrismaIndustryData(parsed) })
  revalidatePath("/")
  revalidatePath(`/industries/${parsed.slug}`)
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteIndustry(id: string) {
  await requireDeleteAction()
  await prisma.industry.delete({ where: { id } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function toggleIndustryPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.industry.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function reorderIndustries(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.industry.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
  await persistD1Bookmark()
}
