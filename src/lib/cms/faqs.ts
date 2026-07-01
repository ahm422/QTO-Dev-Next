import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapFaq } from "./mappers";

export const findPublishedFaqs = cache(
  unstable_cache(
    async (context: string) => {
      const items = await (await getCachedReadPrisma()).faq.findMany({
        where: { isPublished: true, context },
        orderBy: { order: "asc" },
      });
      return items.map(mapFaq);
    },
    ["published-faqs"],
    { revalidate: 3600, tags: ["faqs"] }
  )
);
