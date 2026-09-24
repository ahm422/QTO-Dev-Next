import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { bulletList, joinSections, parseJsonStringArray } from "../textUtils.js";

interface EngagementModelRow {
  id: string;
  number: number;
  title: string;
  description: string;
  features: string;
  is_most_popular: number;
  cta_label: string;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<EngagementModelRow[]> {
  return d1.query<EngagementModelRow>(
    `SELECT id, number, title, description, features, is_most_popular, cta_label, is_published, "order", updated_at FROM engagement_models`
  );
}

function normalize(row: EngagementModelRow): NormalizedRecord {
  const features = parseJsonStringArray(row.features);
  const content = joinSections(
    row.title,
    row.description,
    features.length ? `Includes:\n${bulletList(features)}` : null,
    row.is_most_popular ? "This is our most popular engagement model." : null
  );

  return {
    table: "engagement_models",
    recordId: row.id,
    slug: null,
    title: row.title,
    content,
    metadata: {
      number: row.number,
      isMostPopular: row.is_most_popular === 1,
      ctaLabel: row.cta_label,
      features,
      order: row.order,
      url: "/#engagement-models",
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const engagementModelsSource: SourceDefinition = {
  table: "engagement_models",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
