"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { technologySchema, type TechnologyInput } from "@/lib/validators/admin/technology"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createTechnology(data: TechnologyInput) {
  await requireAdmin()
  await prisma.technology.create({ data: technologySchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/technologies")
}

export async function updateTechnology(id: string, data: TechnologyInput) {
  await requireAdmin()
  await prisma.technology.update({ where: { id }, data: technologySchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/technologies")
}

export async function deleteTechnology(id: string) {
  await requireAdmin()
  await prisma.technology.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleTechnologyPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.technology.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
