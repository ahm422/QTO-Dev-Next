import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { serviceDetailInclude, serviceWithTagsInclude } from "@/lib/prisma/serviceData";
import { orderedTagValues, parseStringArray } from "@/lib/prisma/arrayFields";
import { resolveMediaUrl } from "@/config/staticImages";
import { mapService } from "./mappers";
import { mapPrismaToContentService } from "./mapContentService";
import type {
  ServiceProjectCard,
  WebDevelopmentServiceData,
} from "@/content/services/web-development";

const fallbackProjectThumbnail =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop";

function mapProjectToServiceCard(row: {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  challenge: string | null;
  solution: string | null;
  results: string;
  techStack: { value: string; sortOrder: number }[];
}): ServiceProjectCard {
  const results = parseStringArray(row.results);
  return {
    slug: row.slug,
    name: row.title,
    thumbnail: resolveMediaUrl(row.coverImageUrl) ?? fallbackProjectThumbnail,
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    tech: orderedTagValues(row.techStack),
    result: results[0] ?? "",
  };
}

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
      const prisma = await getCachedReadPrisma();
      const row = await prisma.service.findFirst({
        where: { slug, isPublished: true },
        include: serviceDetailInclude,
      });
      if (!row) return null;

      const projects = await prisma.project.findMany({
        where: { serviceSlug: slug, isPublished: true },
        orderBy: { order: "asc" },
        take: 2,
        include: { techStack: { orderBy: { sortOrder: "asc" } } },
      });

      return mapPrismaToContentService(
        row,
        projects.map(mapProjectToServiceCard)
      );
    },
    ["content-service-by-slug"],
    { revalidate: 3600, tags: ["services", "projects"] }
  )
);
