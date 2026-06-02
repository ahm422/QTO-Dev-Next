import { projectsPageConfig } from "@/config/projectsPage";
import { prisma, upsertBy } from "./helpers";

export async function seedWorkValues() {
  const items = projectsPageConfig.valueSection.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await upsertBy(
      () => prisma.workValue.findFirst({ where: { title: item.title } }),
      () =>
        prisma.workValue.create({
          data: {
            title: item.title,
            description: item.description,
            order: i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.workValue.update({
          where: { id: existing.id },
          data: {
            description: item.description,
            order: i,
            isPublished: true,
          },
        })
    );
  }
}
