import { industriesItems } from "@/data/industries";
import { stringifyStringArray } from "@/lib/prisma/arrayFields";
import { prisma } from "./helpers";

export async function seedIndustries() {
  for (let i = 0; i < industriesItems.length; i++) {
    const item = industriesItems[i];
    const bulletPoints = stringifyStringArray(item.description ? [item.description] : []);
    await prisma.industry.upsert({
      where: { slug: item.id },
      create: {
        name: item.title,
        slug: item.id,
        description: item.description,
        icon: item.icon ?? null,
        bulletPoints,
        order: i,
        isPublished: true,
      },
      update: {
        name: item.title,
        description: item.description,
        icon: item.icon ?? null,
        bulletPoints,
        order: i,
        isPublished: true,
      },
    });
  }
}
