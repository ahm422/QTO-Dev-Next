import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapIndustry } from "./mappers";

export const findPublishedIndustries = cache(async () => {
  const items = await prisma.industry.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map((row, i) => mapIndustry(row, i));
});
