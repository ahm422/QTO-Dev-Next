import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapTeamMember } from "./mappers";

export const findPublishedTeamMembers = cache(async () => {
  const items = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });
  return items.map(mapTeamMember);
});
