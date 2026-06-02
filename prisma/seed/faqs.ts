import { faqItems } from "@/data/faqs";
import { prisma, upsertBy } from "./helpers";

export async function seedFaqs() {
  for (let i = 0; i < faqItems.length; i++) {
    const item = faqItems[i];
    await upsertBy(
      () =>
        prisma.faq.findFirst({
          where: { context: "homepage", question: item.question },
        }),
      () =>
        prisma.faq.create({
          data: {
            question: item.question,
            answer: item.answer,
            context: "homepage",
            order: i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.faq.update({
          where: { id: existing.id },
          data: {
            answer: item.answer,
            order: i,
            isPublished: true,
          },
        })
    );
  }
}
