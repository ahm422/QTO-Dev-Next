import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapTestimonial } from "./mappers";

export const findPublishedTestimonials = cache(
  unstable_cache(
    async () => {
      const items = await prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapTestimonial);
    },
    ["published-testimonials"],
    { revalidate: 3600, tags: ["testimonials"] }
  )
);
