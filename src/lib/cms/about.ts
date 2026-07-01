import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { buildAboutPageContent } from "./mappers";

export const findAboutPageContent = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).aboutContent.findMany({
        orderBy: { order: "asc" },
      });
      return buildAboutPageContent(items);
    },
    ["about-page-content"],
    { revalidate: 3600, tags: ["about"] }
  )
);
