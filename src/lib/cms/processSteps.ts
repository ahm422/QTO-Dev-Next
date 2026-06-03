import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapProcessStep } from "./mappers";

export const findPublishedProcessSteps = cache(async (context: string) => {
  const items = await prisma.processStep.findMany({
    where: { isPublished: true, context },
    orderBy: [{ context: "asc" }, { order: "asc" }],
  });
  return items.map(mapProcessStep);
});
