"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { toPrismaFeaturedWorkData } from "@/lib/prisma/jsonModelData"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { featuredWorkSchema, type FeaturedWorkInput } from "@/lib/validators/admin/featuredWork"
import { persistOrderUpdates } from "@/lib/admin/reorder"

export async function createFeaturedWork(data: FeaturedWorkInput) {
  await requireCreateAction()
  await prisma.featuredWork.create({ data: toPrismaFeaturedWorkData(featuredWorkSchema.parse(data)) })
  revalidatePath("/")
  await persistD1Bookmark()
  redirect("/admin/featured-work")
}

export async function updateFeaturedWork(id: string, data: FeaturedWorkInput) {
  await requireAdminAction()
  await prisma.featuredWork.update({ where: { id }, data: toPrismaFeaturedWorkData(featuredWorkSchema.parse(data)) })
  revalidatePath("/")
  await persistD1Bookmark()
  redirect("/admin/featured-work")
}

export async function deleteFeaturedWork(id: string) {
  await requireDeleteAction()
  await prisma.featuredWork.delete({ where: { id } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function reorderFeaturedWork(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.featuredWork.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function toggleFeaturedWorkPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.featuredWork.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  await persistD1Bookmark()
}
