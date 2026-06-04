import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapIndustry } from "./mappers";

export const findPublishedIndustries = cache(
  unstable_cache(
    async () => {
      const items = await prisma.industry.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map((row, i) => mapIndustry(row, i));
    },
    ["published-industries"],
    { revalidate: 3600, tags: ["industries"] }
  )
);
