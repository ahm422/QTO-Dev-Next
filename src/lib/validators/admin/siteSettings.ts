import { z } from "zod"

/** Empty string or a valid absolute URL (social links; blank = hide from footer). */
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || z.string().url().safeParse(v).success, {
    message: "Enter a valid URL or leave blank",
  })

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required"),
  siteDescription: z.string().trim().min(1, "Description is required"),
  siteUrl: z.string().trim().url("Enter a valid site URL"),
  siteOgImage: z.string().trim().min(1, "OG image path or URL is required"),
  contactEmail: z.string().trim().email("Enter a valid email"),
  contactPhone: z.string().trim().min(1, "Phone is required"),
  contactOffice: z.string().trim().min(1, "Office address is required"),
  socialFacebook: optionalUrl,
  socialInstagram: optionalUrl,
  socialLinkedin: optionalUrl,
  socialTwitter: optionalUrl,
  socialGithub: optionalUrl,
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>

export type SiteSettingsField = keyof SiteSettingsInput

/** Maps form fields → SiteConfig key/label (single source of truth). */
export const SITE_SETTINGS_KEYS: Record<
  SiteSettingsField,
  { key: string; label: string }
> = {
  siteName: { key: "site.name", label: "Site name" },
  siteDescription: { key: "site.description", label: "Site description" },
  siteUrl: { key: "site.url", label: "Site URL" },
  siteOgImage: { key: "site.ogImage", label: "Default OG image" },
  contactEmail: { key: "contact.email", label: "Contact email" },
  contactPhone: { key: "contact.phone", label: "Contact phone" },
  contactOffice: { key: "contact.office", label: "Office address" },
  socialFacebook: { key: "social.facebook", label: "Facebook URL" },
  socialInstagram: { key: "social.instagram", label: "Instagram URL" },
  socialLinkedin: { key: "social.linkedin", label: "LinkedIn URL" },
  socialTwitter: { key: "social.twitter", label: "Twitter URL" },
  socialGithub: { key: "social.github", label: "GitHub URL" },
}

/** Build form defaults from raw SiteConfig rows (missing keys → ""). */
export function siteSettingsFromRows(
  rows: { key: string; value: string }[]
): SiteSettingsInput {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const defaults = {} as SiteSettingsInput
  for (const [field, { key }] of Object.entries(SITE_SETTINGS_KEYS) as [
    SiteSettingsField,
    { key: string; label: string },
  ][]) {
    defaults[field] = map[key] ?? ""
  }
  return defaults
}
