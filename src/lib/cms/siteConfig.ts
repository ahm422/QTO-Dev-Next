import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapSiteConfigRows } from "./mappers";

export const findSiteBranding = cache(async () => {
  const rows = await prisma.siteConfig.findMany();
  return mapSiteConfigRows(rows);
});
