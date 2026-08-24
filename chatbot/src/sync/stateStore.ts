import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLogger } from "../logger.js";

const logger = createLogger("state-store");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../data");
const STATE_FILE = path.join(DATA_DIR, "sync-state.json");

export interface RecordState {
  /** sha256 of the last-indexed content — used to detect changes without re-embedding unchanged rows. */
  contentHash: string;
  /** Qdrant point ids currently holding this record's vectors, so stale chunks can be deleted precisely. */
  pointIds: string[];
  slug: string | null;
  title: string;
  updatedAt: string;
  lastSyncedAt: string;
}

interface StateFile {
  /** version tag so a future format change can migrate instead of silently misreading. */
  version: 1;
  /** table -> recordId -> state */
  tables: Record<string, Record<string, RecordState>>;
  lastFullSyncAt: string | null;
}

const EMPTY_STATE: StateFile = { version: 1, tables: {}, lastFullSyncAt: null };

/**
 * Tracks what has already been indexed into Qdrant, independently of both D1 (the
 * source of truth for content) and Qdrant (which only knows about vectors, not
 * "have I seen this D1 row before and was it published last time I looked").
 *
 * Backed by a single JSON file rather than a database — the entire QTO Dev CMS
 * corpus is on the order of a few hundred rows (see chatbot/README.md), so a
 * file is simpler to run, inspect, and back up than adding a second database
 * dependency, while still being fully separate from the vector store as required.
 * Writes are atomic (write to a temp file, then rename) to avoid a half-written
 * state file if the process is killed mid-sync.
 */
export class SyncStateStore {
  private state: StateFile = structuredClone(EMPTY_STATE);
  private loaded = false;

  async load(): Promise<void> {
    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
    if (!existsSync(STATE_FILE)) {
      this.state = structuredClone(EMPTY_STATE);
      this.loaded = true;
      return;
    }
    try {
      const raw = await readFile(STATE_FILE, "utf-8");
      this.state = JSON.parse(raw) as StateFile;
    } catch (err) {
      logger.error("Failed to read sync-state.json, starting from empty state", err);
      this.state = structuredClone(EMPTY_STATE);
    }
    this.loaded = true;
  }

  private assertLoaded() {
    if (!this.loaded) throw new Error("SyncStateStore.load() must be called before use");
  }

  get(table: string, recordId: string): RecordState | undefined {
    this.assertLoaded();
    return this.state.tables[table]?.[recordId];
  }

  listForTable(table: string): Map<string, RecordState> {
    this.assertLoaded();
    return new Map(Object.entries(this.state.tables[table] ?? {}));
  }

  upsert(table: string, recordId: string, state: RecordState): void {
    this.assertLoaded();
    this.state.tables[table] ??= {};
    this.state.tables[table][recordId] = state;
  }

  delete(table: string, recordId: string): void {
    this.assertLoaded();
    if (this.state.tables[table]) delete this.state.tables[table][recordId];
  }

  markFullSyncComplete(): void {
    this.assertLoaded();
    this.state.lastFullSyncAt = new Date().toISOString();
  }

  get lastFullSyncAt(): string | null {
    return this.state.lastFullSyncAt;
  }

  /** Wipes all tracked state — used by `npm run reindex:all` before a full rebuild. */
  reset(): void {
    this.state = structuredClone(EMPTY_STATE);
  }

  async save(): Promise<void> {
    this.assertLoaded();
    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
    const tmpFile = `${STATE_FILE}.tmp-${process.pid}`;
    await writeFile(tmpFile, JSON.stringify(this.state, null, 2), "utf-8");
    await rename(tmpFile, STATE_FILE);
  }
}

export const syncStateStore = new SyncStateStore();
