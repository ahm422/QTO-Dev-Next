"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { technologySchema, type TechnologyInput } from "@/lib/validators/admin/technology"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import { revalidatePaths } from "@/lib/revalidate"

const PATHS = ["/", "/services"] as const

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createTechnology(data: TechnologyInput) {
  await requireAdmin()
  await prisma.technology.create({ data: technologySchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/technologies")
}

export async function updateTechnology(id: string, data: TechnologyInput) {
  await requireAdmin()
  await prisma.technology.update({ where: { id }, data: technologySchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/technologies")
}

export async function deleteTechnology(id: string) {
  await requireAdmin()
  await prisma.technology.delete({ where: { id } })
  revalidatePaths([...PATHS])
}

export async function toggleTechnologyPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.technology.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
}

export async function reorderTechnologies(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.technology.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
}
