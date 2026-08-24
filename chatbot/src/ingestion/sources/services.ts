import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { bulletList, joinSections, parseJsonStringArray } from "../textUtils.js";

interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  features: string;
  is_published: number;
  order: number;
  updated_at: string;
}

interface TagRow {
  service_id: string;
  value: string;
}

async function fetchRows(): Promise<Array<ServiceRow & { technologyTags: string[] }>> {
  const [services, tags] = await Promise.all([
    d1.query<ServiceRow>(
      `SELECT id, slug, title, short_description, description, icon, features, is_published, "order", updated_at FROM services`
    ),
    d1.query<TagRow>(
      `SELECT service_id, value FROM service_technology_tags ORDER BY sort_order ASC`
    ),
  ]);

  const tagsByService = new Map<string, string[]>();
  for (const t of tags) {
    const list = tagsByService.get(t.service_id) ?? [];
    list.push(t.value);
    tagsByService.set(t.service_id, list);
  }

  return services.map((s) => ({ ...s, technologyTags: tagsByService.get(s.id) ?? [] }));
}

function normalize(row: ServiceRow & { technologyTags: string[] }): NormalizedRecord {
  const features = parseJsonStringArray(row.features);
  const content = joinSections(
    row.title,
    row.short_description,
    row.description,
    features.length ? `Features:\n${bulletList(features)}` : null,
    row.technologyTags.length ? `Technologies used: ${row.technologyTags.join(", ")}` : null
  );

  return {
    table: "services",
    recordId: row.id,
    slug: row.slug,
    title: row.title,
    content,
    metadata: {
      icon: row.icon,
      order: row.order,
      features,
      technologyTags: row.technologyTags,
      url: `/services/${row.slug}`,
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const servicesSource: SourceDefinition = {
  table: "services",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
