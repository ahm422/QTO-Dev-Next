import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapWorkValue } from "./mappers";

export const findPublishedWorkValues = cache(
  unstable_cache(
    async () => {
      const items = await prisma.workValue.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapWorkValue);
    },
    ["published-work-values"],
    { revalidate: 3600, tags: ["work-values"] }
  )
);
