import { env } from "../config/env.js";
import { vectorStore, type SearchResult } from "../vectorstore/qdrant.js";

export interface RetrievedChunk {
  text: string;
  score: number;
  table: string;
  recordId: string | null;
  title: string;
  slug: string | null;
  url: string | null;
}

export async function retrieve(query: string): Promise<RetrievedChunk[]> {
  const results = await vectorStore.search(query, env.RETRIEVAL_TOP_K, env.RETRIEVAL_SCORE_THRESHOLD);
  return results.map(toRetrievedChunk);
}

function toRetrievedChunk(result: SearchResult): RetrievedChunk {
  const meta = result.metadata;
  return {
    text: result.text,
    score: result.score,
    table: String(meta.table ?? "unknown"),
    recordId: typeof meta.recordId === "string" ? meta.recordId : null,
    title: String(meta.title ?? "Untitled"),
    slug: typeof meta.slug === "string" ? meta.slug : null,
    url: typeof meta.url === "string" ? meta.url : null,
  };
}
