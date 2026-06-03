import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapTechnology } from "./mappers";

export const findPublishedTechnologies = cache(async () => {
  const items = await prisma.technology.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapTechnology);
});
