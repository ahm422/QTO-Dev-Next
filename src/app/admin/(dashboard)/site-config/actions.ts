"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { siteConfigSchema, type SiteConfigInput } from "@/lib/validators/admin/siteConfig"


export async function upsertSiteConfig(data: SiteConfigInput) {
  await requireAdminAction()
  const parsed = siteConfigSchema.parse(data)
  await prisma.siteConfig.upsert({
    where: { key: parsed.key },
    create: parsed,
    update: { value: parsed.value, label: parsed.label },
  })
  revalidatePath("/")
}

export async function deleteSiteConfig(key: string) {
  await requireDeleteAction()
  await prisma.siteConfig.delete({ where: { key } })
  revalidatePath("/")
}
