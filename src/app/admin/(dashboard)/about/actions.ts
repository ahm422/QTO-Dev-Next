"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { aboutContentSchema, type AboutContentInput } from "@/lib/validators/admin/aboutContent"

export async function upsertAboutContent(data: AboutContentInput) {
  await requireAdminAction()
  const parsed = aboutContentSchema.parse(data)
  await prisma.aboutContent.upsert({
    where: { section: parsed.section },
    create: parsed,
    update: { title: parsed.title, subtitle: parsed.subtitle, body: parsed.body, imageUrl: parsed.imageUrl, order: parsed.order },
  })
  revalidatePath("/about")
  await persistD1Bookmark()
  redirect("/admin/about")
}

export async function deleteAboutContent(section: string) {
  await requireDeleteAction()
  await prisma.aboutContent.delete({ where: { section } })
  revalidatePath("/about")
  await persistD1Bookmark()
}
