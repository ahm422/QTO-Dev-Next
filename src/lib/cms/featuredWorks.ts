import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapFeaturedWork } from "./mappers";

export const findPublishedFeaturedWorks = cache(async () => {
  const items = await prisma.featuredWork.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map((row, i) => mapFeaturedWork(row, i));
});
