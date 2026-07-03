import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { serviceWithTagsInclude } from "@/lib/prisma/serviceData";
import { mapService } from "./mappers";
import { mapPrismaToContentService } from "./mapContentService";
import type { WebDevelopmentServiceData } from "@/content/services/web-development";

export const findPublishedServices = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).service.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: serviceWithTagsInclude,
      });
      return items.map(mapService);
    },
    ["published-services"],
    { revalidate: 3600, tags: ["services"] }
  )
);

export const findServiceBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const item = await (await getCachedReadPrisma()).service.findFirst({
        where: { slug, isPublished: true },
        include: serviceWithTagsInclude,
      });
      return item ? mapService(item) : null;
    },
    ["service-by-slug"],
    { revalidate: 3600, tags: ["services"] }
  )
);

export const findPublishedServiceSlugs = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).service.findMany({
        where: { isPublished: true },
        select: { slug: true },
        orderBy: { order: "asc" },
      });
      return items.map((i) => i.slug);
    },
    ["published-service-slugs"],
    { revalidate: 3600, tags: ["services"] }
  )
);

export const findContentServiceBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<WebDevelopmentServiceData | null> => {
      const row = await (await getCachedReadPrisma()).service.findFirst({
        where: { slug, isPublished: true },
        include: serviceWithTagsInclude,
      });
      return row ? mapPrismaToContentService(row) : null;
    },
    ["content-service-by-slug"],
    { revalidate: 3600, tags: ["services"] }
  )
);
