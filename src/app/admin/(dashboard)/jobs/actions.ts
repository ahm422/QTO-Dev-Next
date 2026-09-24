"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { toPrismaJobData } from "@/lib/prisma/jsonModelData"
import { revalidatePath } from "next/cache"
import { jobSchema, type JobInput } from "@/lib/validators/admin/job"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync"

export async function createJob(data: JobInput) {
  await requireCreateAction()
  await prisma.job.create({ data: toPrismaJobData(jobSchema.parse(data)) })
  revalidatePath("/careers")
  triggerChatbotSync("jobs")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateJob(id: string, data: JobInput) {
  await requireAdminAction()
  await prisma.job.update({ where: { id }, data: toPrismaJobData(jobSchema.parse(data)) })
  revalidatePath("/careers")
  triggerChatbotSync("jobs")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteJob(id: string) {
  await requireDeleteAction()
  await prisma.job.delete({ where: { id } })
  revalidatePath("/careers")
  triggerChatbotSync("jobs")
  await persistD1Bookmark()
}

export async function toggleJobPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.job.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/careers")
  triggerChatbotSync("jobs")
  await persistD1Bookmark()
}

export async function reorderJobs(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.job.update({ where: { id }, data: { order } })
  )
  revalidatePath("/careers")
  triggerChatbotSync("jobs")
  await persistD1Bookmark()
}
