"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { workValueSchema, type WorkValueInput } from "@/lib/validators/admin/workValue"
import { revalidatePaths } from "@/lib/revalidate"
import { persistOrderUpdates } from "@/lib/admin/reorder"

const PATHS = ["/", "/projects"] as const


export async function createWorkValue(data: WorkValueInput) {
  await requireAdminAction()
  await prisma.workValue.create({ data: workValueSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/work-values")
}

export async function updateWorkValue(id: string, data: WorkValueInput) {
  await requireAdminAction()
  await prisma.workValue.update({ where: { id }, data: workValueSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/work-values")
}

export async function deleteWorkValue(id: string) {
  await requireDeleteAction()
  await prisma.workValue.delete({ where: { id } })
  revalidatePaths([...PATHS])
}

export async function toggleWorkValuePublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.workValue.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
}

export async function reorderWorkValues(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.workValue.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
}
