import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapService } from "./mappers";

export const findPublishedServices = cache(async () => {
  const items = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapService);
});

export const findServiceBySlug = cache(async (slug: string) => {
  const item = await prisma.service.findFirst({
    where: { slug, isPublished: true },
  });
  return item ? mapService(item) : null;
});

export const findPublishedServiceSlugs = cache(async () => {
  const items = await prisma.service.findMany({
    where: { isPublished: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return items.map((i) => i.slug);
});
