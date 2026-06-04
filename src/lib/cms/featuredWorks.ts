import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapFeaturedWork } from "./mappers";

export const findPublishedFeaturedWorks = cache(
  unstable_cache(
    async () => {
      const items = await prisma.featuredWork.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map((row, i) => mapFeaturedWork(row, i));
    },
    ["published-featured-works"],
    { revalidate: 3600, tags: ["featured-works"] }
  )
);
