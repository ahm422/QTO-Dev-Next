import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";

interface TechnologyRow {
  id: string;
  name: string;
  slug: string;
  icon_key: string;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<TechnologyRow[]> {
  return d1.query<TechnologyRow>(
    `SELECT id, name, slug, icon_key, is_published, "order", updated_at FROM technologies`
  );
}

function normalize(row: TechnologyRow): NormalizedRecord {
  return {
    table: "technologies",
    recordId: row.id,
    slug: row.slug,
    title: row.name,
    content: `QTO Dev works with ${row.name}.`,
    metadata: { iconKey: row.icon_key, order: row.order, url: "/services" },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

/**
 * NOT embedded into vector search — confirmed via live testing (see README.md
 * Known Limitations): its 22 rows are all near-identical short sentences
 * ("QTO Dev works with X."), which score artificially high on generic queries
 * and crowd out genuinely relevant `services`/`projects` content. Still read
 * from D1 and allowlisted (visible in GET /metrics), just excluded from the
 * embed/upsert step in the sync engine — see sync/syncEngine.ts.
 */
export const technologiesSource: SourceDefinition = {
  table: "technologies",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
  embeddable: false,
};
