import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { buildAboutPageContent } from "./mappers";

export const findAboutPageContent = cache(async () => {
  const items = await prisma.aboutContent.findMany({
    orderBy: { order: "asc" },
  });
  return buildAboutPageContent(items);
});
