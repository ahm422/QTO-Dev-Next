import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapContactMethod } from "./mappers";

export const findPublishedContactInfo = cache(
  unstable_cache(
    async () => {
      const items = await prisma.contactInfo.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapContactMethod);
    },
    ["published-contact-info"],
    { revalidate: 3600, tags: ["contact-info"] }
  )
);
