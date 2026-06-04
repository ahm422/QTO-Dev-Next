import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { buildAboutPageContent } from "./mappers";

export const findAboutPageContent = cache(
  unstable_cache(
    async () => {
      const items = await prisma.aboutContent.findMany({
        orderBy: { order: "asc" },
      });
      return buildAboutPageContent(items);
    },
    ["about-page-content"],
    { revalidate: 3600, tags: ["about"] }
  )
);
