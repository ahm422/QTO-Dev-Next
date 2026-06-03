import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapJob } from "./mappers";

export const findPublishedJobs = cache(async () => {
  const items = await prisma.job.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapJob);
});
