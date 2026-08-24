import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { SOURCE_REGISTRY } from "../ingestion/registry.js";
import { createLogger } from "../logger.js";

const logger = createLogger("rag-tools");

const TABLE_NAMES = SOURCE_REGISTRY.map((s) => s.table) as [string, ...string[]];

interface ListedRecord {
  title: string;
  url: string | null;
  summary: string;
}

function truncate(text: string, maxChars: number): string {
  const trimmed = text.trim();
  return trimmed.length <= maxChars ? `${trimmed.slice(0, maxChars).trimEnd()}…` : trimmed;
}

// Short TTL cache, keyed by table — `list_records` can be called once per chat turn (or
// more, across a multi-round tool loop), and fetchAndNormalize() re-reads D1 + rebuilds
// prose every time. A 5-minute cache keeps repeated calls cheap without ever serving data
// staler than the background sync loop already tolerates (SYNC_INTERVAL_MINUTES=15 default).
const CACHE_TTL_MS = 5 * 60_000;
const cache = new Map<string, { expiresAt: number; entries: ListedRecord[] }>();

async function listTable(table: string): Promise<ListedRecord[]> {
  const cached = cache.get(table);
  if (cached && cached.expiresAt > Date.now()) return cached.entries;

  const source = SOURCE_REGISTRY.find((s) => s.table === table);
  if (!source) return [];

  const records = await source.fetchAndNormalize();
  const entries = records
    .filter((r) => r.isPublished)
    .map((r) => ({
      title: r.title,
      url: typeof r.metadata.url === "string" ? r.metadata.url : null,
      summary: truncate(r.content, 280),
    }));

  cache.set(table, { expiresAt: Date.now() + CACHE_TTL_MS, entries });
  return entries;
}

/**
 * Structured D1 lookup, bound to the chat model as a tool call. This is the fix for the
 * retrieval-window gap in README.md's Known Limitations: a broad/enumeration question
 * ("what services does QTO Dev offer?") needs the COMPLETE set of rows in one table, not
 * the top-K semantically-nearest chunks vector search returns — no amount of threshold
 * tuning fixes that, because it's a recall problem, not a relevance-scoring problem.
 *
 * `table` is validated against SOURCE_REGISTRY's table names — the same explicit allowlist
 * that governs what this service can ever read out of D1 (see registry.ts). This tool can
 * never reach a table outside it; it has no free-form SQL surface at all.
 */
export const listRecordsTool = tool(
  async ({ table }: { table: string }) => {
    logger.debug("list_records tool called", { table });
    const entries = await listTable(table);
    return JSON.stringify({ table, count: entries.length, records: entries });
  },
  {
    name: "list_records",
    description:
      "Get the COMPLETE, authoritative list of every published QTO Dev record in one category. Use this " +
      "whenever the visitor asks a broad or enumeration-style question — e.g. 'what services do you offer', " +
      "'list your products', 'what industries do you work in', 'what technologies do you use', 'who is on " +
      "your team', 'what are your engagement models', 'what roles are open', 'what's your process'. Prefer " +
      "this tool over relying only on the retrieved <context> for such questions: <context> is a semantic-" +
      "search snippet set that can miss records, while this tool always returns every one. For a narrow " +
      "question about one already-named item, <context> is usually enough — you don't need this tool then.",
    schema: z.object({
      table: z
        .enum(TABLE_NAMES)
        .describe(`Which category to list. One of: ${TABLE_NAMES.join(", ")}.`),
    }),
  }
);

export const ragTools = [listRecordsTool];
