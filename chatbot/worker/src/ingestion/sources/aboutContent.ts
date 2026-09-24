import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { joinSections, parseJsonObject } from "../textUtils.js";

interface AboutContentRow {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  metadata: string | null;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<AboutContentRow[]> {
  return d1.query<AboutContentRow>(
    `SELECT id, section, title, subtitle, body, metadata, is_published, "order", updated_at FROM about_content`
  );
}

/**
 * about_content is the one table in the schema where the real text does not always
 * live in `body` — some sections (e.g. "hero", "values") store their content as
 * structured JSON in `metadata` instead, and `body` is NULL for those rows. This
 * resolver renders whatever shape is actually present into readable prose so the
 * chatbot has real content to embed instead of an empty chunk.
 */
function resolveBodyText(row: AboutContentRow): string {
  if (row.body && row.body.trim().length > 0) return row.body.trim();

  const meta = parseJsonObject(row.metadata);
  if (meta.values && Array.isArray(meta.values)) {
    const values = meta.values as Array<{ title?: string; description?: string }>;
    const lines = values
      .filter((v) => v.title || v.description)
      .map((v) => `- ${v.title ?? ""}: ${v.description ?? ""}`.trim());
    if (lines.length) return `Our values:\n${lines.join("\n")}`;
  }

  // Scalar-stat shape, e.g. { founded, team, clients, projects }
  const scalarEntries = Object.entries(meta).filter(
    ([, v]) => typeof v === "string" || typeof v === "number"
  );
  if (scalarEntries.length) {
    return scalarEntries.map(([k, v]) => `${humanizeKey(k)}: ${v}`).join(". ");
  }

  return "";
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function normalize(row: AboutContentRow): NormalizedRecord {
  const bodyText = resolveBodyText(row);
  const title = row.title ?? row.section;
  const content = joinSections(row.subtitle ? `${title} — ${row.subtitle}` : title, bodyText);

  return {
    table: "about_content",
    recordId: row.id,
    slug: row.section,
    title,
    content,
    metadata: {
      section: row.section,
      order: row.order,
      rawMetadata: parseJsonObject(row.metadata),
      url: "/about",
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const aboutContentSource: SourceDefinition = {
  table: "about_content",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
