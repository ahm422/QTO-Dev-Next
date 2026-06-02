import { engagementModelItems } from "@/data/engagementModels";
import { prisma, upsertBy } from "./helpers";

export async function seedEngagementModels() {
  for (let i = 0; i < engagementModelItems.length; i++) {
    const item = engagementModelItems[i];
    const number = i + 1;
    await upsertBy(
      () => prisma.engagementModel.findFirst({ where: { number } }),
      () =>
        prisma.engagementModel.create({
          data: {
            number,
            title: item.title,
            description: item.description,
            features: item.features,
            isMostPopular: item.isPopular,
            ctaLabel: "Get Started",
            ctaLink: item.getStartedHref,
            order: i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.engagementModel.update({
          where: { id: existing.id },
          data: {
            title: item.title,
            description: item.description,
            features: item.features,
            isMostPopular: item.isPopular,
            ctaLink: item.getStartedHref,
            order: i,
            isPublished: true,
          },
        })
    );
  }
}
