import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { bulletList, joinSections, parseJsonStringArray } from "../textUtils.js";

interface IndustryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  bullet_points: string;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<IndustryRow[]> {
  return d1.query<IndustryRow>(
    `SELECT id, name, slug, description, icon, bullet_points, is_published, "order", updated_at FROM industries`
  );
}

function normalize(row: IndustryRow): NormalizedRecord {
  const bullets = parseJsonStringArray(row.bullet_points);
  const content = joinSections(row.name, row.description, bullets.length ? bulletList(bullets) : null);

  return {
    table: "industries",
    recordId: row.id,
    slug: row.slug,
    title: row.name,
    content,
    metadata: { icon: row.icon, bulletPoints: bullets, order: row.order, url: `/industries/${row.slug}` },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const industriesSource: SourceDefinition = {
  table: "industries",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
