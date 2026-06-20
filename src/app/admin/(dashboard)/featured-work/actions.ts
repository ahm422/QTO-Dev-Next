"use server"

import { getServerSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { featuredWorkSchema, type FeaturedWorkInput } from "@/lib/validators/admin/featuredWork"
import { persistOrderUpdates } from "@/lib/admin/reorder"

async function requireAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createFeaturedWork(data: FeaturedWorkInput) {
  await requireAdmin()
  await prisma.featuredWork.create({ data: featuredWorkSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/featured-work")
}

export async function updateFeaturedWork(id: string, data: FeaturedWorkInput) {
  await requireAdmin()
  await prisma.featuredWork.update({ where: { id }, data: featuredWorkSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/featured-work")
}

export async function deleteFeaturedWork(id: string) {
  await requireAdmin()
  await prisma.featuredWork.delete({ where: { id } })
  revalidatePath("/")
}

export async function reorderFeaturedWork(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.featuredWork.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}

export async function toggleFeaturedWorkPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.featuredWork.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
