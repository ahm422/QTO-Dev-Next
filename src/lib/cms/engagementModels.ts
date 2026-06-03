import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapEngagementModel } from "./mappers";

export const findPublishedEngagementModels = cache(async () => {
  const items = await prisma.engagementModel.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapEngagementModel);
});
