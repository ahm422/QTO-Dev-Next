import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapTeamMember } from "./mappers";

export const findPublishedTeamMembers = cache(
  unstable_cache(
    async () => {
      const items = await prisma.teamMember.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapTeamMember);
    },
    ["published-team-members"],
    { revalidate: 3600, tags: ["team"] }
  )
);
