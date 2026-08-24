/**
 * Parses the JSON-string-array columns used throughout the QTO Dev schema
 * (e.g. services.features, industries.bullet_points, projects.results).
 * Mirrors the tolerant behavior of the main app's parseStringArray
 * (src/lib/prisma/arrayFields.ts) without importing from it — this package
 * must stay fully independent of the root app's source tree.
 */
export function parseJsonStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  } catch {
    return [];
  }
}

/** Parses a JSON object column (e.g. about_content.metadata). Returns {} on any failure. */
export function parseJsonObject(value: string | null | undefined): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/** Strips HTML tags and collapses whitespace — used for blog_posts.content, which is stored as HTML. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Joins non-empty text sections with blank-line separators, skipping falsy sections. */
export function joinSections(...sections: (string | null | undefined)[]): string {
  return sections
    .map((s) => s?.trim())
    .filter((s): s is string => Boolean(s))
    .join("\n\n");
}

export function bulletList(items: string[], emptyFallback = ""): string {
  if (items.length === 0) return emptyFallback;
  return items.map((i) => `- ${i}`).join("\n");
}
