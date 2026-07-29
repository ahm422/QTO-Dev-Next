"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { statSchema, type StatInput } from "@/lib/validators/admin/stat"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { revalidateStatPages } from "@/lib/admin/revalidateStatPages"

export async function createStat(data: StatInput) {
  await requireCreateAction()
  await prisma.stat.create({ data: statSchema.parse(data) })
  revalidateStatPages()
  await persistD1Bookmark()
  return { success: true }
}

export async function updateStat(id: string, data: StatInput) {
  await requireAdminAction()
  await prisma.stat.update({ where: { id }, data: statSchema.parse(data) })
  revalidateStatPages()
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteStat(id: string) {
  await requireDeleteAction()
  await prisma.stat.delete({ where: { id } })
  revalidateStatPages()
  await persistD1Bookmark()
}

export async function toggleStatPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.stat.update({ where: { id }, data: { isPublished: value } })
  revalidateStatPages()
  await persistD1Bookmark()
}

export async function reorderStats(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.stat.update({ where: { id }, data: { order } })
  )
  revalidateStatPages()
  await persistD1Bookmark()
}
