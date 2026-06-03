import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapProject, mapProjectToPortfolioCase } from "./mappers";

export const findPublishedProjects = cache(async (category?: string) => {
  const items = await prisma.project.findMany({
    where: {
      isPublished: true,
      ...(category !== undefined && category !== "" && { category }),
    },
    orderBy: { order: "asc" },
  });
  return items.map(mapProject);
});

export const findPortfolioProjects = cache(async (take = 6) => {
  const items = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take,
  });
  return items.map((row, i) => mapProjectToPortfolioCase(row, i));
});

export const findProjectBySlug = cache(async (slug: string) => {
  const item = await prisma.project.findFirst({
    where: { slug, isPublished: true },
  });
  return item ? mapProject(item) : null;
});

export const findPublishedProjectSlugs = cache(async () => {
  const items = await prisma.project.findMany({
    where: { isPublished: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return items.map((i) => i.slug);
});
