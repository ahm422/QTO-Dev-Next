import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapTechnology } from "./mappers";

export const findPublishedTechnologies = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).technology.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapTechnology);
    },
    ["published-technologies"],
    { revalidate: 3600, tags: ["technologies"] }
  )
);
