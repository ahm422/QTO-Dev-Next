"use server"

import { getServerSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { processStepSchema, type ProcessStepInput } from "@/lib/validators/admin/processStep"
import { revalidatePaths } from "@/lib/revalidate"
import { persistOrderUpdates } from "@/lib/admin/reorder"

const PATHS = ["/", "/services"] as const

async function requireAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createProcessStep(data: ProcessStepInput) {
  await requireAdmin()
  await prisma.processStep.create({ data: processStepSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/process-steps")
}

export async function updateProcessStep(id: string, data: ProcessStepInput) {
  await requireAdmin()
  await prisma.processStep.update({ where: { id }, data: processStepSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/process-steps")
}

export async function deleteProcessStep(id: string) {
  await requireAdmin()
  await prisma.processStep.delete({ where: { id } })
  revalidatePaths([...PATHS])
}

export async function reorderProcessSteps(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.processStep.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
}

export async function toggleProcessStepPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.processStep.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
}
