import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapContactMethod } from "./mappers";

export const findPublishedContactInfo = cache(async () => {
  const items = await prisma.contactInfo.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapContactMethod);
});
