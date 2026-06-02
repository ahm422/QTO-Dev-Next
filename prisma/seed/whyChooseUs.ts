import { whyChooseUsItems } from "@/data/whyChooseUs";
import { servicesWhyChooseUsItems } from "@/data/servicesWhyChooseUs";
import { prisma, upsertBy } from "./helpers";

async function seedContextItems(
  context: string,
  items: { title: string; description: string }[],
  startOrder = 0
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await upsertBy(
      () =>
        prisma.whyChooseUs.findFirst({
          where: { context, title: item.title },
        }),
      () =>
        prisma.whyChooseUs.create({
          data: {
            context,
            title: item.title,
            description: item.description,
            order: startOrder + i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.whyChooseUs.update({
          where: { id: existing.id },
          data: {
            description: item.description,
            order: startOrder + i,
            isPublished: true,
          },
        })
    );
  }
}

export async function seedWhyChooseUs() {
  await seedContextItems("homepage", whyChooseUsItems);
  await seedContextItems("services", servicesWhyChooseUsItems);
}
