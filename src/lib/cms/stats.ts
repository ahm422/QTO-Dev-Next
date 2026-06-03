import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapStat } from "./mappers";

export const findPublishedStats = cache(async () => {
  const items = await prisma.stat.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapStat);
});
