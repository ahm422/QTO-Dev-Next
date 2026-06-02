import { contactMethods } from "./data/contactMethods";
import { prisma, upsertBy } from "./helpers";

export async function seedContactInfo() {
  for (const method of contactMethods) {
    await upsertBy(
      () => prisma.contactInfo.findFirst({ where: { type: method.type } }),
      () =>
        prisma.contactInfo.create({
          data: {
            type: method.type,
            label: method.label,
            value: method.value,
            subLabel: method.subLabel,
            icon: method.icon,
            order: method.order,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.contactInfo.update({
          where: { id: existing.id },
          data: {
            label: method.label,
            value: method.value,
            subLabel: method.subLabel,
            icon: method.icon,
            order: method.order,
            isPublished: true,
          },
        })
    );
  }
}
