"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { aboutContentSchema, type AboutContentInput } from "@/lib/validators/admin/aboutContent"
import { stringifyMetadata } from "@/lib/metadata"

export async function upsertAboutContent(data: AboutContentInput) {
  await requireAdminAction()
  const parsed = aboutContentSchema.parse(data)
  const metadata = parsed.metadata?.trim()
    ? stringifyMetadata(JSON.parse(parsed.metadata))
    : null
  const payload = {
    section: parsed.section,
    title: parsed.title || null,
    subtitle: parsed.subtitle || null,
    body: parsed.body || null,
    imageUrl: parsed.imageUrl || null,
    order: parsed.order,
    metadata,
  }
  await prisma.aboutContent.upsert({
    where: { section: parsed.section },
    create: payload,
    update: {
      title: payload.title,
      subtitle: payload.subtitle,
      body: payload.body,
      imageUrl: payload.imageUrl,
      order: payload.order,
      metadata: payload.metadata,
    },
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
