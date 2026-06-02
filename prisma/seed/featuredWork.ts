import { featuredWorkItems } from "@/data/featuredWork";
import { prisma, upsertBy } from "./helpers";

export async function seedFeaturedWork() {
  for (const item of featuredWorkItems) {
    await upsertBy(
      () => prisma.featuredWork.findFirst({ where: { order: item.order } }),
      () =>
        prisma.featuredWork.create({
          data: {
            title: item.title,
            description: item.description,
            imageUrl: item.image ?? null,
            imageAlt: item.title,
            tags: [item.category],
            link: item.slug ? `/projects/${item.slug}` : null,
            order: item.order,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.featuredWork.update({
          where: { id: existing.id },
          data: {
            title: item.title,
            description: item.description,
            imageUrl: item.image ?? null,
            imageAlt: item.title,
            tags: [item.category],
            link: item.slug ? `/projects/${item.slug}` : null,
            order: item.order,
            isPublished: true,
          },
        })
    );
  }
}
