import { SOURCE_REGISTRY } from "../ingestion/registry.js";
import { chunkRecord, hashRecord } from "../ingestion/chunk.js";
import { vectorStore } from "../vectorstore/vectorize.js";
import { syncStateStore } from "./stateStore.js";
import { createLogger } from "../logger.js";
import type { NormalizedRecord, SourceDefinition } from "../types/document.js";

const logger = createLogger("sync");

export interface SourceSyncSummary {
  table: string;
  ingested: number;
  updated: number;
  unpublished: number;
  removed: number;
  skipped: number;
  errors: number;
}

export interface FullSyncSummary {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  sources: SourceSyncSummary[];
}

let syncInProgress = false;
let lastSummary: FullSyncSummary | null = null;

export function getLastSyncSummary(): FullSyncSummary | null {
  return lastSummary;
}

export function isSyncInProgress(): boolean {
  return syncInProgress;
}

/**
 * Runs one full sync pass across every registered source. For each record this
 * distinguishes four outcomes, matching the requirement this pipeline is built for:
 *   - new record (no prior state)              -> ingest (embed + upsert + record state)
 *   - changed record (content hash differs)      -> re-index (embed + upsert + replace stale chunks)
 *   - unpublished record (still exists, is_published = false) -> exclude (delete vectors + state)
 *   - deleted record (no longer present in D1 at all)          -> remove (delete vectors + state)
 * Unchanged published records are skipped without calling the embedding model or Qdrant.
 */
export async function runFullSync(): Promise<FullSyncSummary> {
  if (syncInProgress) {
    throw new Error("A sync is already in progress");
  }
  syncInProgress = true;
  const startedAt = new Date().toISOString();
  const t0 = Date.now();
  const sources: SourceSyncSummary[] = [];

  try {
    for (const source of SOURCE_REGISTRY) {
      try {
        if (source.embeddable === false) {
          sources.push(await purgeNonEmbeddableSource(source));
          continue;
        }
        sources.push(await syncSource(source.table, await source.fetchAndNormalize()));
      } catch (err) {
        logger.error(`Sync failed for source "${source.table}"`, err);
        sources.push({
          table: source.table,
          ingested: 0,
          updated: 0,
          unpublished: 0,
          removed: 0,
          skipped: 0,
          errors: 1,
        });
      }
    }
    await syncStateStore.markFullSyncComplete();
    await syncStateStore.save();
  } finally {
    syncInProgress = false;
  }

  const finishedAt = new Date().toISOString();
  const summary: FullSyncSummary = { startedAt, finishedAt, durationMs: Date.now() - t0, sources };
  lastSummary = summary;
  logger.info("Full sync complete", summary);
  return summary;
}

/**
 * For sources marked `embeddable: false` (see technologies.ts): never fetches from D1
 * or embeds anything, and actively deletes any vectors/state left over from before the
 * source was marked non-embeddable — so flipping the flag actually removes stale
 * vectors from Qdrant instead of just freezing them there forever.
 */
async function purgeNonEmbeddableSource(source: SourceDefinition): Promise<SourceSyncSummary> {
  const summary: SourceSyncSummary = {
    table: source.table,
    ingested: 0,
    updated: 0,
    unpublished: 0,
    removed: 0,
    skipped: 0,
    errors: 0,
  };

  const priorState = await syncStateStore.listForTable(source.table);
  for (const [recordId, state] of priorState) {
    try {
      await vectorStore.deletePoints(state.pointIds);
      await syncStateStore.delete(source.table, recordId);
      summary.removed++;
    } catch (err) {
      logger.error(`Failed to purge non-embeddable record ${source.table}:${recordId}`, err);
      summary.errors++;
    }
  }

  if (summary.removed) {
    logger.info(`Purged previously-embedded vectors for non-embeddable source "${source.table}"`, summary);
  }
  return summary;
}

async function syncSource(table: string, records: NormalizedRecord[]): Promise<SourceSyncSummary> {
  const summary: SourceSyncSummary = {
    table,
    ingested: 0,
    updated: 0,
    unpublished: 0,
    removed: 0,
    skipped: 0,
    errors: 0,
  };

  const priorState = await syncStateStore.listForTable(table);
  const currentIds = new Set(records.map((r) => r.recordId));

  for (const record of records) {
    try {
      const prior = priorState.get(record.recordId);

      if (!record.isPublished) {
        if (prior) {
          await vectorStore.deletePoints(prior.pointIds);
          await syncStateStore.delete(table, record.recordId);
          summary.unpublished++;
        }
        continue;
      }

      const contentHash = hashRecord(record);
      if (prior && prior.contentHash === contentHash) {
        summary.skipped++;
        continue;
      }

      const documents = await chunkRecord(record);
      const pointIds = await vectorStore.upsertDocuments(documents);

      if (prior) {
        const staleIds = prior.pointIds.filter((id) => !pointIds.includes(id));
        if (staleIds.length) await vectorStore.deletePoints(staleIds);
        summary.updated++;
      } else {
        summary.ingested++;
      }

      await syncStateStore.upsert(table, record.recordId, {
        contentHash,
        pointIds,
        slug: record.slug,
        title: record.title,
        updatedAt: record.updatedAt,
        lastSyncedAt: new Date().toISOString(),
      });
    } catch (err) {
      logger.error(`Failed to sync ${table}:${record.recordId}`, err);
      summary.errors++;
    }
  }

  // Anything still tracked in state but absent from this fetch no longer exists in D1 at all.
  for (const [recordId, state] of priorState) {
    if (!currentIds.has(recordId)) {
      try {
        await vectorStore.deletePoints(state.pointIds);
        await syncStateStore.delete(table, recordId);
        summary.removed++;
      } catch (err) {
        logger.error(`Failed to remove deleted record ${table}:${recordId}`, err);
        summary.errors++;
      }
    }
  }

  if (summary.ingested || summary.updated || summary.removed || summary.unpublished) {
    logger.info(`Synced "${table}"`, summary);
  }
  return summary;
}
