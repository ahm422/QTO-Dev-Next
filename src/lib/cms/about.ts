import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { buildAboutPageContent, mapErpSolutionsContent } from "./mappers";
import { aboutPageConfig } from "@/config/aboutPage";

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

export const findErpSolutionsContent = cache(
  unstable_cache(
    async () => {
      const row = await (await getCachedReadPrisma()).aboutContent.findUnique({
        where: { section: "erp-solutions" },
      });
      return mapErpSolutionsContent(row ?? undefined, aboutPageConfig.erpSolutions);
    },
    ["erp-solutions-content"],
    { revalidate: 3600, tags: ["about"] }
  )
);
