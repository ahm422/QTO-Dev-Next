import { v5 as uuidv5 } from "uuid";

// Fixed namespace so `deterministicPointId("services:web-development:0")` always
// yields the same UUID across runs/machines — this is what makes re-syncing the
// same record an idempotent upsert instead of a duplicate insert.
const POINT_ID_NAMESPACE = "b6c936c2-6b1a-4b9a-9a2f-8f1a2b7d6e10";

/**
 * Vectorize accepts any string id, but this keeps ids short, stable, and collision-free —
 * our own human-readable chunk keys (`table:recordId:chunkIndex`) get converted through
 * this before ever reaching Vectorize. Applied at `Document.id` assignment time (see
 * ingestion/chunk.ts) and passed explicitly as the `ids` option at upsert time (see
 * vectorstore/vectorize.ts) — `CloudflareVectorizeStore.addVectors` only uses that
 * option, never `document.id` on its own.
 */
export function deterministicPointId(chunkId: string): string {
  return uuidv5(chunkId, POINT_ID_NAMESPACE);
}
