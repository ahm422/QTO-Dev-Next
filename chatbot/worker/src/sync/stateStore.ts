export interface RecordState {
  /** sha256 of the last-indexed content — used to detect changes without re-embedding unchanged rows. */
  contentHash: string;
  /** Vectorize vector ids currently holding this record's chunks, so stale ones can be deleted precisely. */
  pointIds: string[];
  slug: string | null;
  title: string;
  updatedAt: string;
  lastSyncedAt: string;
}

let kv: KVNamespace | null = null;

/** Called once per request/scheduled-run from index.ts before any state-store method is used. */
export function bindSyncStateKv(namespace: KVNamespace): void {
  kv = namespace;
}

function requireKv(): KVNamespace {
  if (!kv) throw new Error("Sync-state KV not initialized — call bindSyncStateKv(env.CHATBOT_KV) first");
  return kv;
}

const META_KEY = "syncstate:_meta:lastFullSyncAt";
const tableKey = (table: string) => `syncstate:${table}`;

/**
 * Tracks what has already been indexed into Vectorize, independently of both D1 (source of
 * truth for content) and Vectorize (which only knows about vectors, not "have I seen this
 * D1 row before and was it published last time I looked"). One JSON blob per table in
 * `CHATBOT_KV` (table -> recordId -> `RecordState`) — the whole corpus is a few hundred rows
 * (see chatbot/README.md), small enough that one read/write per table per sync pass is both
 * simpler and cheaper than a KV key per record. Replaces the old service's local JSON file
 * (`data/sync-state.json`), which doesn't survive Workers' ephemeral filesystem.
 *
 * `upsert`/`delete`/`markFullSyncComplete` mutate an in-memory per-table cache (populated
 * lazily from KV on first touch this run); `save()` flushes every table touched since the
 * last save — same "cheap mutate, explicit flush" contract `sync/syncEngine.ts` already
 * expects from the old file-backed version.
 */
class KvSyncStateStore {
  private cache = new Map<string, Map<string, RecordState>>();
  private dirty = new Set<string>();
  private lastFullSyncAtValue: string | null = null;
  private metaLoaded = false;

  async load(): Promise<void> {
    if (this.metaLoaded) return;
    this.lastFullSyncAtValue = await requireKv().get(META_KEY, "text");
    this.metaLoaded = true;
  }

  private async loadTable(table: string): Promise<Map<string, RecordState>> {
    let map = this.cache.get(table);
    if (!map) {
      const raw = await requireKv().get(tableKey(table), "text");
      map = new Map<string, RecordState>(raw ? Object.entries(JSON.parse(raw) as Record<string, RecordState>) : []);
      this.cache.set(table, map);
    }
    return map;
  }

  async get(table: string, recordId: string): Promise<RecordState | undefined> {
    return (await this.loadTable(table)).get(recordId);
  }

  async listForTable(table: string): Promise<Map<string, RecordState>> {
    return new Map(await this.loadTable(table));
  }

  async upsert(table: string, recordId: string, state: RecordState): Promise<void> {
    const map = await this.loadTable(table);
    map.set(recordId, state);
    this.dirty.add(table);
  }

  async delete(table: string, recordId: string): Promise<void> {
    const map = await this.loadTable(table);
    if (map.delete(recordId)) this.dirty.add(table);
  }

  async markFullSyncComplete(): Promise<void> {
    this.lastFullSyncAtValue = new Date().toISOString();
  }

  get lastFullSyncAt(): string | null {
    return this.lastFullSyncAtValue;
  }

  /**
   * Wipes all tracked state for the given tables, immediately (not deferred to `save()`) —
   * used by the `POST /sync/reindex` route before a full rebuild. Pass every registered
   * source table, not just cached ones, so a table untouched this run still gets cleared.
   */
  async reset(tables: string[]): Promise<void> {
    const store = requireKv();
    await Promise.all(tables.map((table) => store.delete(tableKey(table))));
    this.cache.clear();
    this.dirty.clear();
  }

  /** Flushes every table mutated since the last save(), plus the sync-complete timestamp. */
  async save(): Promise<void> {
    const store = requireKv();
    await Promise.all(
      Array.from(this.dirty).map((table) => {
        const map = this.cache.get(table);
        return map ? store.put(tableKey(table), JSON.stringify(Object.fromEntries(map))) : Promise.resolve();
      })
    );
    this.dirty.clear();
    if (this.lastFullSyncAtValue) await store.put(META_KEY, this.lastFullSyncAtValue);
  }
}

export const syncStateStore = new KvSyncStateStore();
