import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapStat } from "./mappers";

export const findPublishedStats = cache(
  unstable_cache(
    async () => {
      const items = await prisma.stat.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapStat);
    },
    ["published-stats"],
    { revalidate: 3600, tags: ["stats"] }
  )
);
