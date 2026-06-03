"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { whyChooseUsSchema, type WhyChooseUsInput } from "@/lib/validators/admin/whyChooseUs"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createWhyChooseUs(data: WhyChooseUsInput) {
  await requireAdmin()
  await prisma.whyChooseUs.create({ data: whyChooseUsSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/why-choose-us")
}

export async function updateWhyChooseUs(id: string, data: WhyChooseUsInput) {
  await requireAdmin()
  await prisma.whyChooseUs.update({ where: { id }, data: whyChooseUsSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/why-choose-us")
}

export async function deleteWhyChooseUs(id: string) {
  await requireAdmin()
  await prisma.whyChooseUs.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleWhyChooseUsPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.whyChooseUs.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}
