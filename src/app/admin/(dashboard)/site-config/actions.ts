"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/admin/siteConfig"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function upsertSiteConfig(data: SiteConfigInput) {
  await requireAdmin()
  const parsed = siteConfigSchema.parse(data)
  await prisma.siteConfig.upsert({
    where: { key: parsed.key },
    create: parsed,
    update: { value: parsed.value, label: parsed.label },
  })
  revalidatePath("/")
}

export async function deleteSiteConfig(key: string) {
  await requireAdmin()
  await prisma.siteConfig.delete({ where: { key } })
  revalidatePath("/")
}
