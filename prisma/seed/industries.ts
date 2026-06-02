import { industriesItems } from "@/data/industries";
import { prisma } from "./helpers";

export async function seedIndustries() {
  for (let i = 0; i < industriesItems.length; i++) {
    const item = industriesItems[i];
    await prisma.industry.upsert({
      where: { slug: item.id },
      create: {
        name: item.title,
        slug: item.id,
        description: item.description,
        icon: item.icon ?? null,
        bulletPoints: item.description ? [item.description] : [],
        order: i,
        isPublished: true,
      },
      update: {
        name: item.title,
        description: item.description,
        icon: item.icon ?? null,
        bulletPoints: item.description ? [item.description] : [],
        order: i,
        isPublished: true,
      },
    });
  }
}
