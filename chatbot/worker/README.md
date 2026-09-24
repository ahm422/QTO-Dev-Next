# QTO Dev Chatbot Worker

Cloudflare Worker rebuild of the standalone RAG chatbot for **qtodev.com**. Same job as the original Node/Express service in [`chatbot/`](../README.md) — read-only D1 content → embed → vector search → DeepSeek — but running entirely on Cloudflare's platform (Workers, D1, Vectorize, Workers AI, KV) instead of a long-lived Node process plus an external Qdrant instance.

**Status**: deployed and verified end-to-end against real production D1 content — full sync (13 sources, 0 errors), multi-turn `/chat/stream` with tool-calling (`list_records`), KV-backed conversation memory, and the main site's live chat widget (via `CHATBOT_SERVICE_URL`) all confirmed working in production.

Live URL: `https://qtodev-chatbot-worker.your-subdomain.workers.dev`

---

## 1. Why a separate Worker instead of reusing `chatbot/`

The old service depends on three things that don't run on Workers:

- `better-sqlite3` (native module, local D1 file access) — no filesystem, no native addons on Workers.
- `@huggingface/transformers` (local embedding model inference) — no local model execution on Workers' runtime.
- `setInterval`, an in-memory `Map` per session/rate-limit bucket, and a JSON file on disk — none of this survives Workers' stateless, per-isolate, ephemeral-filesystem execution model.

Rather than patch around these, each was replaced with the Cloudflare-native equivalent (table in §3). The two services are independent — this directory has its own `package.json`/`node_modules`/`wrangler.jsonc` and doesn't import anything from `chatbot/src`.

## 2. Architecture

**Sync** (cron-triggered every `SYNC_INTERVAL_MINUTES`; immediately for the changed table after every admin-panel save — see §7a; or manually via `POST /sync/run` / `POST /sync/reindex`):

```
┌────────────────────────────┐
│   D1 (native binding)      │
│  read-only · 14 tables     │
└────────────────────────────┘
               │  fetch
               ▼
┌────────────────────────────┐
│         Normalize          │
│   row → prose + metadata   │
└────────────────────────────┘
               │  hash
               ▼
┌────────────────────────────┐
│   CHATBOT_KV (sync state)  │
│   one blob per table       │
└────────────────────────────┘
      unchanged → skip / new / changed
               │
               ▼
┌────────────────────────────┐
│           Chunk            │
│  RecursiveCharacterText    │
│         Splitter           │
└────────────────────────────┘
               │
               ▼
┌────────────────────────────┐
│        Workers AI          │
│  @cf/baai/bge-small-en-v1.5│
└────────────────────────────┘
               │
               ▼
┌────────────────────────────┐
│          Vectorize         │
│   upsert · metadata filter │
└────────────────────────────┘

unpublished / deleted in D1  →  delete vectors + state
```

**Chat request** (`POST /chat/stream` — the only endpoint the main site's chat widgets call):

```
┌────────────────────────────┐
│            User            │
└────────────────────────────┘
               │  POST /chat/stream
               ▼
┌────────────────────────────┐
│            Hono             │
│   validate · rate-limit    │
│      (CHATBOT_KV)          │
└────────────────────────────┘
               │
               ▼
┌────────────────────────────┐
│         Retriever          │
│  embed query → Vectorize   │
│ top-K · isPublished filter │
└────────────────────────────┘
               │  chunks + metadata
               ▼
┌────────────────────────────┐
│   Prompt + tool-calling    │
│ system + history + context │
│  (list_records tool)       │
└────────────────────────────┘
               │
               ▼
┌────────────────────────────┐
│         ChatOpenAI         │
│  DeepSeek (configurable)   │
└────────────────────────────┘
               │  SSE: token* → done
               ▼
┌────────────────────────────┐
│   Conversation store       │
│  CHATBOT_KV, TTL'd/session │
└────────────────────────────┘
               │  { sessionId, reply }
               ▼
┌────────────────────────────┐
│            User            │
└────────────────────────────┘
```

## 3. What changed vs. the original Node service

| Concern | `chatbot/` (Node/Express) | `chatbot/worker/` (this service) |
|---|---|---|
| D1 access | `better-sqlite3` (local file) or HTTP API (remote) | Native `DB` binding — [src/d1/client.ts](src/d1/client.ts) |
| Vector store | Qdrant (`QdrantVectorStore`) | Cloudflare Vectorize, via `@langchain/cloudflare`'s `CloudflareVectorizeStore` — [src/vectorstore/vectorize.ts](src/vectorstore/vectorize.ts) |
| Embeddings | `Xenova/all-MiniLM-L6-v2`, local inference | Workers AI `@cf/baai/bge-small-en-v1.5` (384-dim, same as before), via `CloudflareWorkersAIEmbeddings` |
| HTTP framework | Express | Hono — [src/api/server.ts](src/api/server.ts) |
| Conversation history | In-memory `Map` + `InMemoryChatMessageHistory` | `CHATBOT_KV`, one TTL'd key per session, keyed by the caller's own session id — [src/conversation/store.ts](src/conversation/store.ts), see §7b |
| Rate limiting | In-memory, per-process (explicitly not safe multi-instance) | `CHATBOT_KV`, fixed-window per IP — actually holds across Cloudflare's edge — [src/api/middleware/rateLimit.ts](src/api/middleware/rateLimit.ts) |
| Sync state | `data/sync-state.json` on disk | `CHATBOT_KV`, one JSON blob per table — [src/sync/stateStore.ts](src/sync/stateStore.ts) |
| Scheduling | `setInterval` loop in-process | Cron Trigger (`wrangler.jsonc` → `triggers.crons`) + `scheduled()` export in [src/index.ts](src/index.ts) |
| Point IDs | Qdrant-valid UUIDv5 of `table:recordId:chunkIndex` | Same UUIDv5 scheme kept (Vectorize accepts any string id; a stable one is still what makes re-sync idempotent) — [src/vectorstore/pointId.ts](src/vectorstore/pointId.ts) |

Everything else — ingestion sources (14 D1 tables), chunking, the `list_records` tool, the RAG/tool-calling loop, the sync diff logic (ingest/re-index/skip/exclude/remove) — is the same logic, ported with import-path changes only. See `chatbot/README.md` §2–§6 for what isn't repeated here (allowlisted tables, the `technologies` embeddable-false rationale). The **system prompt itself has since diverged** from the original — see §5a, guardrails were tightened specifically on this Worker.

`chatbot_faqs` is an additional, admin-managed source (not present in the original Node service): general Q&A entries created under **Admin → Chatbot FAQs** in the main site. They are never rendered on the public site — they exist only to extend this Worker's knowledge base. See [src/ingestion/sources/chatbotFaqs.ts](src/ingestion/sources/chatbotFaqs.ts).

## 4. Bindings (`wrangler.jsonc`)

| Binding | Resource | Notes |
|---|---|---|
| `DB` | D1 database `qtodev-d1` | Same database the main `qto-dev-next` Worker uses — read-only in code (`assertSelectOnly`), even though the binding itself is full read/write |
| `VECTORIZE` | Vectorize index `qtodev-chatbot-kb` | 384 dimensions, cosine metric; metadata indexes on `isPublished` (boolean), `table`, `slug` (string) |
| `AI` | Workers AI | Embeddings model configured via `EMBEDDING_MODEL` var, not a separate binding-level setting |
| `CHATBOT_KV` | KV namespace `qtodev-chatbot-state` | Key-prefixed: `session:<id>` (conversation history; `<id>` is e.g. `public_sess_…` / `admin_sess_…` from the main site), `ratelimit:<ip>:<windowStart>`, `syncstate:<table>` / `syncstate:_meta:lastFullSyncAt` |
| cron trigger | `*/15 * * * *` | Must be kept in sync with `SYNC_INTERVAL_MINUTES` below if changed |

Provisioned via:

```bash
npx wrangler vectorize create qtodev-chatbot-kb --dimensions=384 --metric=cosine
npx wrangler vectorize create-metadata-index qtodev-chatbot-kb --property-name=isPublished --type=boolean
npx wrangler vectorize create-metadata-index qtodev-chatbot-kb --property-name=table --type=string
npx wrangler vectorize create-metadata-index qtodev-chatbot-kb --property-name=slug --type=string
npx wrangler kv namespace create qtodev-chatbot-state
```

## 5. Config (`wrangler.jsonc` → `vars`) and secrets

Plaintext vars — see [src/config/env.ts](src/config/env.ts) for the full Zod schema/defaults:

| Var | Default |
|---|---|
| `EMBEDDING_MODEL` / `EMBEDDING_DIMENSIONS` | `@cf/baai/bge-small-en-v1.5` / `384` |
| `CHUNK_MAX_CHARS` / `CHUNK_OVERLAP_CHARS` | `1500` / `150` |
| `RETRIEVAL_TOP_K` / `RETRIEVAL_SCORE_THRESHOLD` | `5` / `0.3` |
| `LLM_PROVIDER_BASE_URL` / `LLM_MODEL` | `https://api.deepseek.com/v1` / `deepseek-chat` |
| `LLM_TEMPERATURE` / `LLM_MAX_OUTPUT_TOKENS` | `0.3` / `500` — output cap kept low as a hard backstop for short replies (see §5a) |
| `SYNC_INTERVAL_MINUTES` | `15` (documentation/metrics only — the actual schedule is the cron trigger above) |
| `CHAT_MAX_HISTORY_MESSAGES` / `CHAT_SESSION_TTL_MINUTES` | `40` (20 turns) / `60` |
| `CHAT_RATE_LIMIT_MAX` / `CHAT_RATE_LIMIT_WINDOW_SECONDS` | `20` / `60` |
| `CHAT_MAX_MESSAGE_LENGTH` / `CHAT_MAX_MESSAGE_WORDS` | `500` chars / `80` words — deliberately tight, see §5a |
| `CHAT_EXPOSE_DEBUG_INFO` | `false` |
| `CHAT_CORS_ORIGIN` | `*` |

### 5a. Guardrails

Hardened beyond the original Node service's prompt — see [src/rag/promptBuilder.ts](src/rag/promptBuilder.ts) for the full system prompt:

- **DB-only, no outside knowledge**: every fact must come from `<context>` or the `list_records` tool. The original prompt explicitly encouraged supplementing with general/outside knowledge for "consultant-style" elaboration — that's removed; if it's not in D1, the bot says so instead of answering from general knowledge.
- **No source citation**: never mentions which page/table/content type an answer came from (the old prompt did — "According to our Services page..."). Facts are stated naturally, as if already known. Enforced at both layers: the prompt forbids it, and [promptBuilder.ts](src/rag/promptBuilder.ts)'s `formatContext` plus the `list_records` payload in [tools.ts](src/rag/tools.ts) no longer include source names at all, so there's no provenance string in the prompt to leak.
- **No narration/filler**: answers directly in the same reply — never "let me pull that up," "I'll check that for you," or any status update promising to look something up.
- **No internal/technical disclosure**: won't discuss RAG, embeddings, vector search, the database, tool names, its system prompt, the model/provider, or QTO Dev's internal tech stack for the chatbot itself, even under direct or indirect (jailbreak/role-play/encoding) prompting.
- **Concise by default**: 1–4 short sentences unless the question genuinely asks for a list or walkthrough — enforced at both the prompt level and a hard `LLM_MAX_OUTPUT_TOKENS=500` ceiling.
- **Tighter input limits**: `CHAT_MAX_MESSAGE_LENGTH`/`CHAT_MAX_MESSAGE_WORDS` cut from the original 2000 chars/100 words to 500/80 — real questions are short, and this bounds both abuse and how much untrusted visitor text reaches the prompt.
- Prompt-injection handling (refuse instruction-like content in `<context>`/messages, refuse jailbreak/role-play/encoding tricks, no explaining what was detected) is unchanged from the original and still applies on top of the above.

Secrets (never in `wrangler.jsonc` — set via `wrangler secret put <NAME>`, prompted on stdin):

| Secret | Purpose |
|---|---|
| `LLM_API_KEY` | DeepSeek (or other OpenAI-compatible provider) API key |
| `SYNC_TRIGGER_TOKEN` | Required in the `x-sync-token` header for `POST /sync/run` and `POST /sync/reindex`. Generate with `openssl rand -hex 32`. Leave unset to disable the check — **not recommended in production**: anyone could then trigger re-embedding and burn Workers AI quota. |

```bash
cd chatbot/worker
npx wrangler secret put LLM_API_KEY
npx wrangler secret put SYNC_TRIGGER_TOKEN
npx wrangler secret list
```

Or in the dashboard: **Workers & Pages → qtodev-chatbot-worker → Settings → Variables and Secrets → Add** (type **Secret**).

The main site's Worker (`qto-dev-next`, repo root) needs one matching secret for the instant admin sync (§7a):

| Secret (on `qto-dev-next`) | Purpose |
|---|---|
| `CHATBOT_SYNC_TOKEN` | Must equal this Worker's `SYNC_TRIGGER_TOKEN`. Set from the repo root with `npx wrangler secret put CHATBOT_SYNC_TOKEN`. |

For `wrangler dev`, put the same values in `chatbot/worker/.dev.vars` (git-ignored):

```
LLM_API_KEY=sk-...
SYNC_TRIGGER_TOKEN=...
```

## 6. API endpoints

| Method | Path | Purpose | Auth |
|---|---|---|---|
| `POST` | `/chat` | Send `{ message, sessionId? }` → `{ sessionId, reply }` (non-streaming). `sessionId` must match `^[A-Za-z0-9_-]{8,128}$`; omit it to get a server-generated one | rate-limited |
| `POST` | `/chat/stream` | Same contract, SSE (`token`/`done`/`error` events) — **this is what the main site's public/admin chat widgets call**, via `src/lib/chat/backendChatProvider.ts` in the root app | rate-limited |
| `GET` | `/health` | D1 + Vectorize connectivity, sync-in-progress state | none |
| `GET` | `/metrics` | Table-access count/list, retrieval config, sync state | none |
| `POST` | `/sync/run` | Trigger a sync pass. No body = full sync, returns the summary. Optional JSON body `{ "tables": ["faqs"], "background": true }` syncs only those tables and, with `background`, returns `202` immediately and finishes in `waitUntil` (used by the admin panel, §7a). Unknown table names → `400`; a sync already running on the isolate → `409`. | optional `x-sync-token` |
| `POST` | `/sync/reindex` | Full rebuild — deletes every tracked vector, wipes KV sync state, re-syncs from scratch. Worker-native replacement for the old service's `npm run reindex:all` CLI script. | optional `x-sync-token` |
| `GET` | `/sync/status` | Last sync summary (per-isolate — see §8) | none |

With `CHAT_EXPOSE_DEBUG_INFO=true`, `/chat` and `/chat/stream`'s `done` event also include `sources`/`timing`/`toolsUsed` — off by default for the customer-facing widget.

## 7. Local dev / deploy

```bash
npm install
npm run dev              # wrangler dev — note: AI and Vectorize typically hit real remote resources even in dev
npm run cf-typegen        # regenerate worker-configuration.d.ts after changing bindings in wrangler.jsonc
npm run typecheck
npm run deploy            # wrangler deploy
```

```bash
curl -X POST https://qtodev-chatbot-worker.your-subdomain.workers.dev/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "What services does QTO Dev offer?"}'
```

### Cloudflare Workers Builds (git-connected deploys)

In the Worker's **Settings → Build**:

| Setting | Value |
|---|---|
| Branch | one that actually contains `chatbot/worker/` (currently `chatbot-cloudflare` — `main` doesn't have it yet) |
| Root directory | `chatbot/worker` |
| Build command | `npm run build` (= `tsc --noEmit`, a type check only), or leave empty — `wrangler deploy` bundles on its own |
| Deploy command | `npm run deploy` |

The Worker name connected in the dashboard must match `"name"` in `wrangler.jsonc` (`qtodev-chatbot-worker`).

**Common mistake:** if the build log shows `> qtodev-chatbot@0.1.0 build > tsc`, the root directory is set to `chatbot` — that's the old Node/Express service, which can't run on Workers (`better-sqlite3`, local HuggingFace models). Its `npm run build` only runs TypeScript and never packages this Worker. Point the root directory at `chatbot/worker`.

## 7a. Instant sync from the admin panel

The cron still runs every 15 minutes as a safety net, but content edits don't have to wait for it. Every create / update / delete / publish-toggle / reorder in the main site's admin panel — both the server actions in `src/app/admin/(dashboard)/<section>/actions.ts` and the `src/app/api/admin/<section>/` routes — calls `triggerChatbotSync("<table>")` ([src/lib/chat/triggerChatbotSync.ts](../../src/lib/chat/triggerChatbotSync.ts) in the root app).

That helper sends `POST /sync/run` with `{ tables: [<table>], background: true }` and the `x-sync-token` header. It is fire-and-forget, handed to the runtime via `waitUntil`, so the admin save is never slowed down and never fails because of the chatbot. The Worker returns `202` and re-syncs just that one table, which keeps the work small enough for the post-response `waitUntil` budget. Typically the change is live in chat within seconds.

Covered tables: `about_content`, `blog_posts`, `chatbot_faqs`, `engagement_models`, `faqs`, `industries`, `jobs`, `process_steps`, `products`, `projects`, `services`, `team_members`, `testimonials`. `technologies` is intentionally not triggered — it isn't embedded, and `list_records` reads it live from D1.

If a trigger is lost, the next cron pass still applies the change. That covers a `409` because a sync is already running on that isolate, a network error, or a token mismatch (`401`, which is logged in the main site as `[chatbot-sync] …`).

Setup: `CHATBOT_SYNC_TOKEN` on the main site must equal `SYNC_TRIGGER_TOKEN` here (see §5).

## 7b. Conversation memory (per session)

The bot remembers earlier turns within one chat session, e.g. "tell me more about the second one" works after a list answer.

- The main site's widget keeps a session id in `localStorage`, generated with `crypto.randomUUID()` (`src/hooks/useChatPersistence.ts`). `backendChatProvider.ts` sends it as `sessionId`, prefixed `public_` or `admin_` so the two widgets never share history.
- This Worker uses that id directly as the KV key `session:<id>`. There is deliberately **no server-side id mapping**. An earlier version mapped widget ids to backend UUIDs in an in-memory `Map` in the Next.js app, which was lost between Worker isolates, so the bot forgot every previous message.
- History is capped at `CHAT_MAX_HISTORY_MESSAGES` (40 messages = 20 turns) and expires after `CHAT_SESSION_TTL_MINUTES` (60) of inactivity. Clearing the browser's storage starts a new session.

## 8. Known limitations

- **`lastSync` resets per isolate**: `GET /health` and `GET /sync/status`'s `lastSync` field comes from an in-memory variable in `sync/syncEngine.ts` (ported unchanged from the Node service), which isn't shared across Worker isolates or persisted to KV. The sync itself is fully durable (Vectorize + `CHATBOT_KV`) — only this one status field can read as `null` on a cold isolate even though the last sync succeeded. Fixable by persisting the summary to KV in a follow-up if reliable "when did sync last run" reporting is needed.
- **Sync lock is per isolate**: `syncInProgress` is an in-memory flag, so two isolates (e.g. cron + an admin-triggered sync) can run at the same time. This is safe in practice, because point ids are deterministic (UUIDv5), so concurrent upserts overwrite rather than duplicate. The worst case is one redundant re-embed.
- KV-based rate limiting is eventually consistent (approximate under concurrent bursts) — an accepted trade-off, same spirit as the old limiter's documented single-instance-only caveat, but this one actually holds across the whole edge instead of not at all.

**Resolved**: the root Next.js app's `CHATBOT_SERVICE_URL` (in `wrangler.toml` → `[vars]`, both production and `[env.staging.vars]`) now points at this Worker's live URL and has been redeployed — production chat traffic reaches this service.
