import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const findPageSection = cache(
  unstable_cache(
    async (slug: string) => {
      const row = await prisma.pageSection.findUnique({
        where: { slug, isPublished: true },
      });
      return row?.data ?? null;
    },
    ["page-section"],
    { revalidate: 3600, tags: ["page-sections"] }
  )
);

export const findAllPageSections = cache(
  unstable_cache(
    async () => {
      return prisma.pageSection.findMany({ orderBy: { slug: "asc" } });
    },
    ["all-page-sections"],
    { revalidate: 3600, tags: ["page-sections"] }
  )
);
