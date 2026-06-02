import { siteConfig } from "@/data/site";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  OFFICE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants";
import { prisma } from "./helpers";

const entries: { key: string; value: string; label?: string }[] = [
  { key: "site.name", value: siteConfig.name, label: "Site name" },
  { key: "site.description", value: siteConfig.description, label: "Site description" },
  { key: "site.url", value: siteConfig.url, label: "Site URL" },
  { key: "site.ogImage", value: siteConfig.ogImage, label: "Default OG image" },
  { key: "site.name.constants", value: SITE_NAME, label: "Site name (constants)" },
  { key: "site.url.constants", value: SITE_URL, label: "Site URL (constants)" },
  { key: "site.description.constants", value: SITE_DESCRIPTION, label: "Description (constants)" },
  { key: "contact.email", value: CONTACT_EMAIL, label: "Contact email" },
  { key: "contact.phone", value: CONTACT_PHONE, label: "Contact phone" },
  { key: "contact.office", value: OFFICE_ADDRESS, label: "Office address" },
];

export async function seedSiteConfig() {
  for (const entry of entries) {
    await prisma.siteConfig.upsert({
      where: { key: entry.key },
      create: entry,
      update: { value: entry.value, label: entry.label ?? null },
    });
  }
}
