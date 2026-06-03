"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { processStepSchema, type ProcessStepInput } from "@/lib/validators/admin/processStep"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createProcessStep(data: ProcessStepInput) {
  await requireAdmin()
  await prisma.processStep.create({ data: processStepSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/process-steps")
}

export async function updateProcessStep(id: string, data: ProcessStepInput) {
  await requireAdmin()
  await prisma.processStep.update({ where: { id }, data: processStepSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/process-steps")
}

export async function deleteProcessStep(id: string) {
  await requireAdmin()
  await prisma.processStep.delete({ where: { id } })
  revalidatePath("/")
}

export async function reorderProcessSteps(items: { id: string; order: number }[]) {
  await requireAdmin()
  await Promise.all(items.map((i) => prisma.processStep.update({ where: { id: i.id }, data: { order: i.order } })))
  revalidatePath("/")
}

export async function toggleProcessStepPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.processStep.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
