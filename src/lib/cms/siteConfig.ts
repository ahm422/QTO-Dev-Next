import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapSiteConfigRows } from "./mappers";

export const findSiteBranding = cache(
  unstable_cache(
    async () => {
      const rows = await (await getCachedReadPrisma()).siteConfig.findMany();
      return mapSiteConfigRows(rows);
    },
    ["site-branding"],
    { revalidate: 3600, tags: ["site-config"] }
  )
);
