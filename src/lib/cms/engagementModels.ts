import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapEngagementModel } from "./mappers";

export const findPublishedEngagementModels = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).engagementModel.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapEngagementModel);
    },
    ["published-engagement-models"],
    { revalidate: 3600, tags: ["engagement-models"] }
  )
);
