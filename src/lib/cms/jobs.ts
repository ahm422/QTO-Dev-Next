import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapJob } from "./mappers";

export const findPublishedJobs = cache(
  unstable_cache(
    async () => {
      const items = await prisma.job.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapJob);
    },
    ["published-jobs"],
    { revalidate: 3600, tags: ["jobs"] }
  )
);
