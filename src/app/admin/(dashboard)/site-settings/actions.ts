"use server"

import { requireAdminAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { revalidatePath, revalidateTag } from "next/cache"
import {
  SITE_SETTINGS_KEYS,
  siteSettingsSchema,
  type SiteSettingsField,
  type SiteSettingsInput,
} from "@/lib/validators/admin/siteSettings"

export async function saveSiteSettings(input: SiteSettingsInput) {
  await requireAdminAction()
  const parsed = siteSettingsSchema.parse(input)

  for (const field of Object.keys(SITE_SETTINGS_KEYS) as SiteSettingsField[]) {
    const { key, label } = SITE_SETTINGS_KEYS[field]
    const value = parsed[field]
    await prisma.siteConfig.upsert({
      where: { key },
      create: { key, value, label },
      update: { value, label },
    })
  }

  revalidatePath("/")
  revalidateTag("site-config", "max")
  await persistD1Bookmark()
}
