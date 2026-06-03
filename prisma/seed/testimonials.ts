import { testimonialsItems } from "@/data/testimonials";
import { prisma, upsertBy } from "./helpers";

export async function seedTestimonials() {
  for (let i = 0; i < testimonialsItems.length; i++) {
    const item = testimonialsItems[i];
    await upsertBy(
      () =>
        prisma.testimonial.findFirst({
          where: {
            clientName: item.authorName,
            clientCompany: item.company,
          },
        }),
      () =>
        prisma.testimonial.create({
          data: {
            clientName: item.authorName,
            clientRole: item.authorTitle,
            clientCompany: item.company,
            quote: item.quote,
            mediaType: item.mediaType ?? "none",
            mediaUrl: item.mediaUrl ?? null,
            mediaAlt: item.authorName,
            rating: 5,
            order: i,
            isPublished: true,
          },
        }),
      (existing) =>
        prisma.testimonial.update({
          where: { id: existing.id },
          data: {
            clientRole: item.authorTitle,
            quote: item.quote,
            mediaType: item.mediaType ?? "none",
            mediaUrl: item.mediaUrl ?? null,
            order: i,
            isPublished: true,
          },
        })
    );
  }
}
