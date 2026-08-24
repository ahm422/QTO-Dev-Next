import { QdrantClient } from "@qdrant/js-client-rest";
import { QdrantVectorStore } from "@langchain/qdrant";
import type { Document } from "@langchain/core/documents";
import { env } from "../config/env.js";
import { createLogger } from "../logger.js";
import { embeddings } from "../embeddings/provider.js";

const logger = createLogger("qdrant");

export interface SearchResult {
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

/**
 * Thin wrapper around LangChain's `QdrantVectorStore`. A single raw `QdrantClient`
 * is shared between the LangChain vector store (documents add/search/delete) and
 * this class's own collection-lifecycle methods (create/recreate/payload indexes,
 * ping) — those aren't part of LangChain's generic `VectorStore` interface, so
 * they stay on the raw client, same as before this file used LangChain at all.
 */
export class VectorStore {
  private readonly client: QdrantClient;
  private store: QdrantVectorStore | null = null;

  constructor() {
    this.client = new QdrantClient({
      url: env.QDRANT_URL,
      apiKey: env.QDRANT_API_KEY || undefined,
    });
  }

  private async getStore(): Promise<QdrantVectorStore> {
    if (!this.store) {
      this.store = new QdrantVectorStore(embeddings, {
        client: this.client,
        collectionName: env.QDRANT_COLLECTION,
      });
    }
    return this.store;
  }

  async ensureCollection(): Promise<void> {
    const collections = await this.client.getCollections();
    const exists = collections.collections.some((c) => c.name === env.QDRANT_COLLECTION);
    if (!exists) {
      logger.info(`Creating Qdrant collection "${env.QDRANT_COLLECTION}"...`);
      await this.client.createCollection(env.QDRANT_COLLECTION, {
        vectors: { size: env.EMBEDDING_DIMENSIONS, distance: "Cosine" },
      });
    }
    // Payload indexes make filtered search (e.g. isPublished, table) fast even as the corpus grows.
    // `@langchain/qdrant` nests our metadata under a top-level "metadata" key in the
    // Qdrant payload (content lives under "content") — field names here must match
    // that actual on-disk shape, not the flat Document.metadata shape LangChain
    // hands back to callers after a search.
    await Promise.all(
      ["metadata.table", "metadata.isPublished", "metadata.slug"].map((field) =>
        this.client
          .createPayloadIndex(env.QDRANT_COLLECTION, {
            field_name: field,
            field_schema: field === "metadata.isPublished" ? "bool" : "keyword",
          })
          .catch(() => undefined)
      )
    );
  }

  /** Recreates the collection from scratch — used by `npm run reindex:all`. */
  async recreateCollection(): Promise<void> {
    const collections = await this.client.getCollections();
    if (collections.collections.some((c) => c.name === env.QDRANT_COLLECTION)) {
      await this.client.deleteCollection(env.QDRANT_COLLECTION);
    }
    this.store = null;
    await this.ensureCollection();
  }

  /**
   * Embeds and upserts documents via LangChain's QdrantVectorStore. Each document's
   * `id` must already be a Qdrant-valid UUID by this point (see ingestion/chunk.ts —
   * `deterministicPointId` is applied there, not here, because `addDocuments` prefers
   * `document.id` over any `ids` option). Returns the point IDs used, for the caller
   * to persist in sync state (needed later to delete these exact points).
   */
  async upsertDocuments(documents: Document[]): Promise<string[]> {
    if (documents.length === 0) return [];
    const store = await this.getStore();
    await store.addDocuments(documents);
    return documents.map((d) => d.id!);
  }

  async deletePoints(pointIds: string[]): Promise<void> {
    if (pointIds.length === 0) return;
    const store = await this.getStore();
    await store.delete({ ids: pointIds });
  }

  async search(query: string, topK: number, scoreThreshold: number): Promise<SearchResult[]> {
    const store = await this.getStore();
    const results = await store.similaritySearchWithScore(query, topK, {
      must: [{ key: "metadata.isPublished", match: { value: true } }],
    });

    return results
      .filter(([, score]) => score >= scoreThreshold)
      .map(([doc, score]) => ({ score, text: doc.pageContent, metadata: doc.metadata }));
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.getCollections();
      return true;
    } catch (err) {
      logger.warn("Qdrant ping failed", err);
      return false;
    }
  }
}

export const vectorStore = new VectorStore();
