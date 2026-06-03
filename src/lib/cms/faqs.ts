import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapFaq } from "./mappers";

export const findPublishedFaqs = cache(async (context: string) => {
  const items = await prisma.faq.findMany({
    where: { isPublished: true, context },
    orderBy: { order: "asc" },
  });
  return items.map(mapFaq);
});
