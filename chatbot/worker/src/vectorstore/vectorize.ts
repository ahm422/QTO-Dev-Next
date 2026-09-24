import { CloudflareVectorizeStore, CloudflareWorkersAIEmbeddings } from "@langchain/cloudflare";
import type { Document } from "@langchain/core/documents";
import { env } from "../config/env.js";
import { createLogger } from "../logger.js";

const logger = createLogger("vectorize");

export interface SearchResult {
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

const MAX_VECTORIZE_METADATA_BYTES = 9_500; // stay under Vectorize's ~10KB per-vector metadata cap

/**
 * Vectorize vector metadata may only be string/number/boolean, or a string[] — never a
 * nested object or a non-string array. A couple of ingestion sources (e.g. about_content's
 * `rawMetadata`) carry arbitrary JSON shapes for citation/debugging purposes; those get
 * stringified here rather than rejected at upsert time. Values Vectorize already accepts
 * pass straight through, so this is a no-op for the vast majority of fields.
 */
function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, string | number | boolean | string[]> {
  const out: Record<string, string | number | boolean | string[]> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    } else if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      out[key] = value as string[];
    } else {
      out[key] = JSON.stringify(value);
    }
  }
  return out;
}

/**
 * Thin wrapper around `@langchain/cloudflare`'s `CloudflareVectorizeStore`, exposing the
 * same shape `rag/retriever.ts` and `sync/syncEngine.ts` already call (ported unchanged
 * from the old Qdrant-backed version of this file) — `upsertDocuments`/`deletePoints`/
 * `search`/`ping`. The index itself and its metadata indexes (`table`, `isPublished`,
 * `slug`) are provisioned ahead of time via `wrangler vectorize create` /
 * `create-metadata-index` (see wrangler.jsonc), not at runtime.
 */
class VectorStore {
  private index: VectorizeIndex | null = null;
  private ai: Ai | null = null;
  private store: CloudflareVectorizeStore | null = null;

  /** Called once per request from index.ts before any other method here is used. */
  bind(index: VectorizeIndex, ai: Ai): void {
    this.index = index;
    this.ai = ai;
  }

  private getStore(): CloudflareVectorizeStore {
    if (!this.store) {
      if (!this.index || !this.ai) {
        throw new Error("Vectorize not initialized — call vectorStore.bind(env.VECTORIZE, env.AI) first");
      }
      const embeddings = new CloudflareWorkersAIEmbeddings({ binding: this.ai, model: env.EMBEDDING_MODEL });
      this.store = new CloudflareVectorizeStore(embeddings, { index: this.index });
    }
    return this.store;
  }

  async upsertDocuments(documents: Document[]): Promise<string[]> {
    if (documents.length === 0) return [];
    const sanitized = documents.map((doc) => {
      const metadata = sanitizeMetadata(doc.metadata as Record<string, unknown>);
      const size = new TextEncoder().encode(JSON.stringify(metadata) + doc.pageContent).length;
      if (size > MAX_VECTORIZE_METADATA_BYTES) {
        logger.warn(`Metadata+text for "${doc.id}" is ${size} bytes, near Vectorize's per-vector limit`);
      }
      return { ...doc, metadata };
    });
    const store = this.getStore();
    return store.addDocuments(sanitized, { ids: sanitized.map((d) => d.id!) });
  }

  async deletePoints(pointIds: string[]): Promise<void> {
    if (pointIds.length === 0) return;
    await this.getStore().delete({ ids: pointIds });
  }

  async search(query: string, topK: number, scoreThreshold: number): Promise<SearchResult[]> {
    const store = this.getStore();
    const results = await store.similaritySearchWithScore(query, topK, { isPublished: true });
    return results
      .filter(([, score]) => score >= scoreThreshold)
      .map(([doc, score]) => ({ score, text: doc.pageContent, metadata: doc.metadata }));
  }

  async ping(): Promise<boolean> {
    try {
      if (!this.index) return false;
      await this.index.describe();
      return true;
    } catch (err) {
      logger.warn("Vectorize ping failed", err);
      return false;
    }
  }
}

export const vectorStore = new VectorStore();
