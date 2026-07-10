import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { mapStat } from "./mappers";
import type { MetricItem } from "@/components/marketing/TrustStripAnimated";

export const findPublishedStats = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).stat.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
      });
      return items.map(mapStat);
    },
    ["published-stats"],
    { revalidate: 3600, tags: ["stats"] }
  )
);

const TRUST_METRIC_DEFAULTS: MetricItem[] = [
  {
    icon: "star",
    value: "100+",
    label: "projects delivered",
  },
  {
    icon: "users",
    value: "7+ years",
    label: "product experience",
  },
  {
    icon: "circle-check",
    value: "98%",
    label: "client satisfaction",
  },
];

const TRUST_METRIC_MAP: {
  cmsLabel: string;
  icon: NonNullable<MetricItem["icon"]>;
  label: string;
}[] = [
  {
    cmsLabel: "Projects Delivered",
    icon: "star",
    label: "projects delivered",
  },
  {
    cmsLabel: "Years Experience",
    icon: "users",
    label: "product experience",
  },
  {
    cmsLabel: "Client Satisfaction",
    icon: "circle-check",
    label: "client satisfaction",
  },
];

export async function getTrustMetrics(): Promise<MetricItem[]> {
  const stats = await findPublishedStats();
  const byLabel = new Map(stats.map((stat) => [stat.label, stat.value]));

  return TRUST_METRIC_MAP.map((mapping, index) => {
    const cmsValue = byLabel.get(mapping.cmsLabel);
    const fallback = TRUST_METRIC_DEFAULTS[index];

    return {
      icon: mapping.icon,
      value: cmsValue ?? fallback.value,
      label: mapping.label,
    };
  });
}
