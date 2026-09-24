/** A normalized, human-readable document derived from one D1 row (or a small group of related rows). */
export interface NormalizedRecord {
  /** Source table name, exactly as it exists in D1 (e.g. "services", "blog_posts"). */
  table: string;
  /** Primary key of the source row in D1. */
  recordId: string;
  /** Public slug, if the source table has one (used to link back / cite). */
  slug: string | null;
  /** Short human title, used for citations and logs. */
  title: string;
  /** Full normalized text to embed — NOT the raw row, always human-composed prose. */
  content: string;
  /** Extra structured facts kept alongside the vector for filtering/citation, never embedded verbatim. */
  metadata: Record<string, unknown>;
  /** Whether this record is currently publicly visible on the site. */
  isPublished: boolean;
  /** ISO timestamp of the row's last update, used for logging/debugging only (hash drives change detection). */
  updatedAt: string;
}

export interface SourceDefinition {
  /** D1 table name this source reads from (used as the `table` tag on every document/chunk). */
  table: string;
  /** Reads every current row for this source (published and unpublished) and returns normalized records. */
  fetchAndNormalize: () => Promise<NormalizedRecord[]>;
  /**
   * Whether this source's rows are embedded into Qdrant and eligible as /chat sources.
   * Defaults to true. Set false for tables whose content doesn't carry enough distinguishing
   * prose for semantic search to help — see technologies.ts for why, and the confirmed
   * live-testing evidence in README.md's Known Limitations.
   */
  embeddable?: boolean;
}
