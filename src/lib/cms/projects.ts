import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { projectWithRelationsInclude } from "@/lib/prisma/projectData";
import { mapProject, mapProjectToPortfolioCase } from "./mappers";
import { mapPrismaToContentProject } from "./mapContentProject";
import type { Project as ContentProject } from "@/content/projects/types";

export const findPublishedProjects = cache(
  unstable_cache(
    async (category?: string) => {
      const items = await (await getCachedReadPrisma()).project.findMany({
        where: {
          isPublished: true,
          ...(category !== undefined && category !== "" && { category }),
        },
        orderBy: { order: "asc" },
        include: projectWithRelationsInclude,
      });
      return items.map(mapProject);
    },
    ["published-projects"],
    { revalidate: 3600, tags: ["projects"] }
  )
);

export const findPortfolioProjects = cache(
  unstable_cache(
    async (take = 6) => {
      const items = await (await getCachedReadPrisma()).project.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
        take,
        include: projectWithRelationsInclude,
      });
      return items.map((row, i) => mapProjectToPortfolioCase(row, i));
    },
    ["portfolio-projects"],
    { revalidate: 3600, tags: ["projects"] }
  )
);

export const findProjectBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const item = await (await getCachedReadPrisma()).project.findFirst({
        where: { slug, isPublished: true },
        include: projectWithRelationsInclude,
      });
      return item ? mapProject(item) : null;
    },
    ["project-by-slug"],
    { revalidate: 3600, tags: ["projects"] }
  )
);

export const findPublishedProjectSlugs = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).project.findMany({
        where: { isPublished: true },
        select: { slug: true },
        orderBy: { order: "asc" },
      });
      return items.map((i) => i.slug);
    },
    ["published-project-slugs"],
    { revalidate: 3600, tags: ["projects"] }
  )
);

export const findContentProjectBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<ContentProject | null> => {
      const row = await (await getCachedReadPrisma()).project.findFirst({
        where: { slug, isPublished: true },
        include: projectWithRelationsInclude,
      });
      if (!row) return null;

      const all = await (await getCachedReadPrisma()).project.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: projectWithRelationsInclude,
      });
      return mapPrismaToContentProject(row, all);
    },
    ["content-project-by-slug"],
    { revalidate: 3600, tags: ["projects"] }
  )
);
