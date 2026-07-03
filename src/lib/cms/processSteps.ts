import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapProcessStep } from "./mappers";

export const findPublishedProcessSteps = cache(
  unstable_cache(
    async (context: string) => {
      const items = await (await getCachedReadPrisma()).processStep.findMany({
        where: { isPublished: true, context },
        orderBy: [{ context: "asc" }, { order: "asc" }],
      });
      return items.map(mapProcessStep);
    },
    ["published-process-steps"],
    { revalidate: 3600, tags: ["process-steps"] }
  )
);
