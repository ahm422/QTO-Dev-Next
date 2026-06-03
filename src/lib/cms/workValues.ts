import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapWorkValue } from "./mappers";

export const findPublishedWorkValues = cache(async () => {
  const items = await prisma.workValue.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapWorkValue);
});
