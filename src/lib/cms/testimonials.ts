import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapTestimonial } from "./mappers";

export const findPublishedTestimonials = cache(async () => {
  const items = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapTestimonial);
});
