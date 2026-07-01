import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapContactMethod } from "./mappers";

export const findPublishedContactInfo = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).contactInfo.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapContactMethod);
    },
    ["published-contact-info"],
    { revalidate: 3600, tags: ["contact-info"] }
  )
);
