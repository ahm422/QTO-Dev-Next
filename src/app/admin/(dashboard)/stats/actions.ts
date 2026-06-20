"use server"

import { getServerSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { statSchema, type StatInput } from "@/lib/validators/admin/stat"
import { persistOrderUpdates } from "@/lib/admin/reorder"

async function requireAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createStat(data: StatInput) {
  await requireAdmin()
  await prisma.stat.create({ data: statSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/stats")
}

export async function updateStat(id: string, data: StatInput) {
  await requireAdmin()
  await prisma.stat.update({ where: { id }, data: statSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/stats")
}

export async function deleteStat(id: string) {
  await requireAdmin()
  await prisma.stat.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleStatPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.stat.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}

export async function reorderStats(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.stat.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}
