import { createHash } from "node:crypto";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { env } from "../config/env.js";
import { deterministicPointId } from "../vectorstore/pointId.js";
import type { NormalizedRecord } from "../types/document.js";

/** Deterministic content hash — drives "changed vs unchanged" detection in the sync engine. */
export function hashRecord(record: NormalizedRecord): string {
  const payload = JSON.stringify({
    title: record.title,
    content: record.content,
    metadata: record.metadata,
    isPublished: record.isPublished,
  });
  return createHash("sha256").update(payload).digest("hex");
}

let splitter: RecursiveCharacterTextSplitter | null = null;
function getSplitter(): RecursiveCharacterTextSplitter {
  if (!splitter) {
    splitter = new RecursiveCharacterTextSplitter({
      chunkSize: env.CHUNK_MAX_CHARS,
      chunkOverlap: env.CHUNK_OVERLAP_CHARS,
      // Default separators already prioritize paragraph -> sentence -> word; that
      // matches the previous hand-written paragraph-aware splitter's behavior.
    });
  }
  return splitter;
}

/**
 * Splits a normalized record's text into one or more LangChain `Document`s via
 * `RecursiveCharacterTextSplitter`. Most QTO Dev CMS records are short enough to
 * stay a single chunk (see chatbot/README.md for measured content sizes); this
 * only kicks in for longer records (e.g. a future, longer blog post).
 *
 * Each resulting Document's `id` is set to a deterministic UUID derived from
 * `{table}:{recordId}:{chunkIndex}` (via `deterministicPointId`) so re-syncing the same
 * record is an idempotent upsert instead of a duplicate insert — Vectorize accepts any
 * string id, but a stable one is what makes precise stale-chunk deletion possible (see
 * vectorstore/vectorize.ts and sync/syncEngine.ts). The original human-readable key is
 * kept in `metadata.chunkId` for logging/debugging/citation.
 */
export async function chunkRecord(record: NormalizedRecord): Promise<Document[]> {
  const documentId = `${record.table}:${record.recordId}`;
  const source = new Document({
    pageContent: record.content.trim(),
    metadata: {
      table: record.table,
      recordId: record.recordId,
      slug: record.slug,
      title: record.title,
      isPublished: record.isPublished,
      updatedAt: record.updatedAt,
      ...record.metadata,
    },
  });

  const splitDocs = await getSplitter().splitDocuments([source]);

  return splitDocs.map((doc, index) => {
    const chunkId = `${documentId}:${index}`;
    doc.metadata.chunkId = chunkId;
    doc.metadata.chunkIndex = index;
    doc.metadata.chunkCount = splitDocs.length;
    doc.id = deterministicPointId(chunkId);
    return doc;
  });
}
