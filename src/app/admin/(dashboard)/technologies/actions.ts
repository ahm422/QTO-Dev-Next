"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { technologySchema, type TechnologyInput } from "@/lib/validators/admin/technology"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { revalidatePaths } from "@/lib/revalidate"

const PATHS = ["/", "/services"] as const


export async function createTechnology(data: TechnologyInput) {
  await requireCreateAction()
  await prisma.technology.create({ data: technologySchema.parse(data) })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
  return { success: true }
}

export async function updateTechnology(id: string, data: TechnologyInput) {
  await requireAdminAction()
  await prisma.technology.update({ where: { id }, data: technologySchema.parse(data) })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteTechnology(id: string) {
  await requireDeleteAction()
  await prisma.technology.delete({ where: { id } })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
}

export async function toggleTechnologyPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.technology.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
}

export async function reorderTechnologies(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.technology.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
  await persistD1Bookmark()
}
