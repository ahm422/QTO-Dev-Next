"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { whyChooseUsSchema, type WhyChooseUsInput } from "@/lib/validators/admin/whyChooseUs"
import { revalidatePaths } from "@/lib/revalidate"
import { persistOrderUpdates } from "@/lib/admin/reorder"

const PATHS = ["/", "/services"] as const

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createWhyChooseUs(data: WhyChooseUsInput) {
  await requireAdmin()
  await prisma.whyChooseUs.create({ data: whyChooseUsSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/why-choose-us")
}

export async function updateWhyChooseUs(id: string, data: WhyChooseUsInput) {
  await requireAdmin()
  await prisma.whyChooseUs.update({ where: { id }, data: whyChooseUsSchema.parse(data) })
  revalidatePaths([...PATHS])
  redirect("/admin/why-choose-us")
}

export async function deleteWhyChooseUs(id: string) {
  await requireAdmin()
  await prisma.whyChooseUs.delete({ where: { id } })
  revalidatePaths([...PATHS])
}

export async function toggleWhyChooseUsPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.whyChooseUs.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...PATHS])
}

export async function reorderWhyChooseUs(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.whyChooseUs.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...PATHS])
}
