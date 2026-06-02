import { statsNumbersItems } from "@/data/statsNumbers";
import { prisma, upsertBy } from "./helpers";

const variantColors: Record<string, string> = {
  default: "default",
  gold: "gold",
  dark: "dark",
};

export async function seedStats() {
  for (let i = 0; i < statsNumbersItems.length; i++) {
    const item = statsNumbersItems[i];
    await upsertBy(
      () => prisma.stat.findFirst({ where: { label: item.label } }),
      () =>
        prisma.stat.create({
          data: {
            label: item.label,
            value: item.value,
            description: item.description,
            color: variantColors[item.variant] ?? item.variant,
            order: i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.stat.update({
          where: { id: existing.id },
          data: {
            value: item.value,
            description: item.description,
            color: variantColors[item.variant] ?? item.variant,
            order: i,
            isPublished: true,
          },
        })
    );
  }
}
