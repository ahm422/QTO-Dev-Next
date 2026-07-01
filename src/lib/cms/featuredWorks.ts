import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapFeaturedWork } from "./mappers";

export const findPublishedFeaturedWorks = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).featuredWork.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map((row, i) => mapFeaturedWork(row, i));
    },
    ["published-featured-works"],
    { revalidate: 3600, tags: ["featured-works"] }
  )
);
