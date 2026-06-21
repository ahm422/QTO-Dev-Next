"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { jobSchema, type JobInput } from "@/lib/validators/admin/job"
import { persistOrderUpdates } from "@/lib/admin/reorder"


export async function createJob(data: JobInput) {
  await requireCreateAction()
  const { postedAt, expiresAt, ...rest } = jobSchema.parse(data)
  await prisma.job.create({ data: { ...rest, postedAt: postedAt ? new Date(postedAt) : null, expiresAt: expiresAt ? new Date(expiresAt) : null } })
  revalidatePath("/careers")
  redirect("/admin/jobs")
}

export async function updateJob(id: string, data: JobInput) {
  await requireAdminAction()
  const { postedAt, expiresAt, ...rest } = jobSchema.parse(data)
  await prisma.job.update({ where: { id }, data: { ...rest, postedAt: postedAt ? new Date(postedAt) : null, expiresAt: expiresAt ? new Date(expiresAt) : null } })
  revalidatePath("/careers")
  redirect("/admin/jobs")
}

export async function deleteJob(id: string) {
  await requireDeleteAction()
  await prisma.job.delete({ where: { id } })
  revalidatePath("/careers")
}

export async function toggleJobPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.job.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/careers")
}

export async function reorderJobs(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.job.update({ where: { id }, data: { order } })
  )
  revalidatePath("/careers")
}
