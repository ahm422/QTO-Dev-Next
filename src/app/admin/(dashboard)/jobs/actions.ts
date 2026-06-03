"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { jobSchema, type JobInput } from "@/lib/validators/admin/job"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createJob(data: JobInput) {
  await requireAdmin()
  const { postedAt, expiresAt, ...rest } = jobSchema.parse(data)
  await prisma.job.create({ data: { ...rest, postedAt: postedAt ? new Date(postedAt) : null, expiresAt: expiresAt ? new Date(expiresAt) : null } })
  revalidatePath("/careers")
  redirect("/admin/jobs")
}

export async function updateJob(id: string, data: JobInput) {
  await requireAdmin()
  const { postedAt, expiresAt, ...rest } = jobSchema.parse(data)
  await prisma.job.update({ where: { id }, data: { ...rest, postedAt: postedAt ? new Date(postedAt) : null, expiresAt: expiresAt ? new Date(expiresAt) : null } })
  revalidatePath("/careers")
  redirect("/admin/jobs")
}

export async function deleteJob(id: string) {
  await requireAdmin()
  await prisma.job.delete({ where: { id } })
  revalidatePath("/careers")
}

export async function toggleJobPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.job.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/careers")
}
