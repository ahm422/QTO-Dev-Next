import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapProcessStep } from "./mappers";

export const findPublishedProcessSteps = cache(
  unstable_cache(
    async (context: string) => {
      const items = await prisma.processStep.findMany({
        where: { isPublished: true, context },
        orderBy: [{ context: "asc" }, { order: "asc" }],
      });
      return items.map(mapProcessStep);
    },
    ["published-process-steps"],
    { revalidate: 3600, tags: ["process-steps"] }
  )
);
