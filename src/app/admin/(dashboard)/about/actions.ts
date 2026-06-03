"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { aboutContentSchema, type AboutContentInput } from "@/lib/validators/admin/aboutContent"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function upsertAboutContent(data: AboutContentInput) {
  await requireAdmin()
  const parsed = aboutContentSchema.parse(data)
  await prisma.aboutContent.upsert({
    where: { section: parsed.section },
    create: parsed,
    update: { title: parsed.title, subtitle: parsed.subtitle, body: parsed.body, imageUrl: parsed.imageUrl, order: parsed.order },
  })
  revalidatePath("/about")
  redirect("/admin/about")
}

export async function deleteAboutContent(section: string) {
  await requireAdmin()
  await prisma.aboutContent.delete({ where: { section } })
  revalidatePath("/about")
}
