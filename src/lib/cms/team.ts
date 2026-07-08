import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapTeamMember } from "./mappers";

export const findPublishedTeamMembers = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).teamMember.findMany({
        where: { isPublished: true, isFounder: false },
        orderBy: { order: "asc" },
      });
      return items.map(mapTeamMember);
    },
    ["published-team-members"],
    { revalidate: 3600, tags: ["team"] }
  )
);

export const findFounderTeamMember = cache(
  unstable_cache(
    async () => {
      const row = await (await getCachedReadPrisma()).teamMember.findFirst({
        where: { isPublished: true, isFounder: true },
      });
      return row ? mapTeamMember(row) : null;
    },
    ["founder-team-member"],
    { revalidate: 3600, tags: ["team"] }
  )
);
