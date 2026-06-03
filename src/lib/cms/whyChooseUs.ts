import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapWhyChooseUs } from "./mappers";

export const findPublishedWhyChooseUs = cache(async (context: string) => {
  const items = await prisma.whyChooseUs.findMany({
    where: { isPublished: true, context },
    orderBy: { order: "asc" },
  });
  return items.map(mapWhyChooseUs);
});
