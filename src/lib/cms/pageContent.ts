import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { parseMetadata } from "@/lib/metadata";

export const findPageSection = cache(
  unstable_cache(
    async (slug: string) => {
      const row = await (await getCachedReadPrisma()).pageSection.findUnique({
        where: { slug, isPublished: true },
      });
      return row ? parseMetadata(row.data) : null;
    },
    ["page-section"],
    { revalidate: 3600, tags: ["page-sections"] }
  )
);

export const findAllPageSections = cache(
  unstable_cache(
    async () => {
      return (await getCachedReadPrisma()).pageSection.findMany({ orderBy: { slug: "asc" } });
    },
    ["all-page-sections"],
    { revalidate: 3600, tags: ["page-sections"] }
  )
);
