import { v5 as uuidv5 } from "uuid";

// Fixed namespace so `deterministicPointId("services:web-development:0")` always
// yields the same UUID across runs/machines — this is what makes re-syncing the
// same record an idempotent upsert instead of a duplicate insert.
const POINT_ID_NAMESPACE = "b6c936c2-6b1a-4b9a-9a2f-8f1a2b7d6e10";

/**
 * Qdrant only accepts an unsigned integer or a UUID as a point ID — our own
 * human-readable chunk keys (`table:recordId:chunkIndex`) get converted through
 * this before ever reaching Qdrant. Must be applied at `Document.id` assignment
 * time (see ingestion/chunk.ts): `@langchain/qdrant`'s `addDocuments` uses
 * `document.id` ahead of any `ids` option passed alongside it, so setting the
 * UUID only at the upsert call site is too late once `document.id` is already set.
 */
export function deterministicPointId(chunkId: string): string {
  return uuidv5(chunkId, POINT_ID_NAMESPACE);
}
