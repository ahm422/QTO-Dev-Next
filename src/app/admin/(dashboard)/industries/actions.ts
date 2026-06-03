"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { industrySchema, type IndustryInput } from "@/lib/validators/admin/industry"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createIndustry(data: IndustryInput) {
  await requireAdmin()
  await prisma.industry.create({ data: industrySchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/industries")
}

export async function updateIndustry(id: string, data: IndustryInput) {
  await requireAdmin()
  const parsed = industrySchema.parse(data)
  await prisma.industry.update({ where: { id }, data: parsed })
  revalidatePath("/")
  revalidatePath(`/industries/${parsed.slug}`)
  redirect("/admin/industries")
}

export async function deleteIndustry(id: string) {
  await requireAdmin()
  await prisma.industry.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleIndustryPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.industry.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
