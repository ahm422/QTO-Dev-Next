import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapWhyChooseUs } from "./mappers";

export const findPublishedWhyChooseUs = cache(
  unstable_cache(
    async (context: string) => {
      const items = await (await getCachedReadPrisma()).whyChooseUs.findMany({
        where: { isPublished: true, context },
        orderBy: { order: "asc" },
      });
      return items.map(mapWhyChooseUs);
    },
    ["published-why-choose-us"],
    { revalidate: 3600, tags: ["why-choose-us"] }
  )
);
