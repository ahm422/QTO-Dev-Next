# QTO Dev Chatbot Worker

The AI assistant behind the chat widgets on **qtodev.com**, running entirely on Cloudflare (Workers, D1, Vectorize, Workers AI, KV).

It reads published CMS content from the site's D1 database (read-only), indexes it into a vector store, and answers visitor questions with retrieval-augmented generation (RAG) through an OpenAI-compatible LLM (DeepSeek by default). Answers are grounded only in qtodev.com content.

| | |
|---|---|
| **Live URL** | `https://qtodev-chatbot-worker.your-subdomain.workers.dev` |
| **Worker name** | `qtodev-chatbot-worker` |
| **Called by** | The main site's `/api/chat` and `/api/admin/chat` routes (server-side only) |
| **Status** | In production. Full sync (13 embedded sources, 0 errors), multi-turn streaming chat with tool-calling, and the live site widget are verified end-to-end. |

---

## Contents

1. [Quick start](#1-quick-start)
2. [How it works](#2-how-it-works)
3. [Project structure](#3-project-structure)
4. [Knowledge sources](#4-knowledge-sources)
5. [Configuration](#5-configuration)
6. [API reference](#6-api-reference)
7. [Integration with the main site](#7-integration-with-the-main-site)
8. [Deployment](#8-deployment)
9. [Operations](#9-operations)
10. [Guardrails](#10-guardrails)
11. [Troubleshooting](#11-troubleshooting)
12. [Known limitations](#12-known-limitations)
13. [Appendix: migration from the Node service](#13-appendix-migration-from-the-node-service)

---

## 1. Quick start

```bash
cd chatbot/worker
npm install

# Local secrets (git-ignored)
cat > .dev.vars <<'EOF'
LLM_API_KEY=sk-...
SYNC_TRIGGER_TOKEN=any-local-token
EOF

npm run dev          # wrangler dev → http://localhost:8787
```

In another terminal:

```bash
# Index content (first run embeds every published record)
curl -X POST http://localhost:8787/sync/run -H "x-sync-token: any-local-token"

# Ask a question
curl -N -X POST http://localhost:8787/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "What services does QTO Dev offer?"}'
```

> In `wrangler dev`, the **AI** and **Vectorize** bindings typically hit the real remote resources. Local runs therefore use real Workers AI quota and write to the real index.

To point the main site at your local worker, set `CHATBOT_SERVICE_URL="http://localhost:8787"` in the root `.env`. That is also the default.

---

## 2. How it works

### Indexing (sync)

A sync runs in three cases:

- every 15 minutes, on the cron trigger;
- right after any admin-panel save, for the changed table only (see [§7.2](#72-instant-sync-from-the-admin-panel));
- on demand, via `POST /sync/run` or `POST /sync/reindex`.

```
D1 (14 allowlisted tables, read-only)
   │ fetch published + unpublished rows
   ▼
Normalize ── row → prose text + metadata
   │ sha256 content hash
   ▼
Compare with sync state (CHATBOT_KV, one blob per table)
   │
   ├─ unchanged            → skip (no embedding call)
   ├─ new / changed        → chunk → embed (Workers AI) → upsert (Vectorize)
   ├─ unpublished in D1    → delete its vectors + state
   └─ deleted from D1      → delete its vectors + state
```

Vector ids are deterministic (UUIDv5 of `table:recordId:chunkIndex`), so re-syncing is idempotent. Upserting the same record twice overwrites it and never creates duplicates.

### Answering (chat)

```
Visitor ─► main site /api/chat ─► POST /chat/stream (this worker)
                                     │
                                     ├─ validate input, rate-limit (KV)
                                     ├─ load session history (KV)
                                     ├─ embed question → Vectorize top-K (published only)
                                     ├─ prompt = system rules + history + <context> + question
                                     ├─ LLM (DeepSeek), may call list_records tool (≤3 rounds)
                                     ├─ stream tokens back as SSE
                                     └─ save the turn to session history (KV)
```

The `list_records` tool gives the model the complete list of one category, e.g. "list all your services". Semantic search alone can miss records on broad questions like that.

---

## 3. Project structure

```
chatbot/worker/
├── wrangler.jsonc              # bindings, vars, cron — the Worker's config
├── worker-configuration.d.ts   # generated binding types (npm run cf-typegen)
├── src/
│   ├── index.ts                # entry: fetch() → Hono app, scheduled() → cron sync
│   ├── config/env.ts           # Zod schema + defaults for every var/secret
│   ├── api/
│   │   ├── server.ts           # Hono app, CORS, error handling
│   │   ├── errors.ts           # uniform { error: { type, message } } responses
│   │   ├── middleware/rateLimit.ts
│   │   └── routes/             # chat, sync, health, metrics
│   ├── rag/
│   │   ├── chatService.ts      # retrieval + tool-calling loop + streaming
│   │   ├── promptBuilder.ts    # system prompt (guardrails live here)
│   │   ├── retriever.ts        # Vectorize similarity search
│   │   └── tools.ts            # list_records tool
│   ├── ingestion/
│   │   ├── registry.ts         # THE allowlist of readable tables
│   │   ├── sources/*.ts        # one file per table: SQL + row → text
│   │   ├── chunk.ts            # splitting + content hashing
│   │   └── textUtils.ts
│   ├── sync/
│   │   ├── syncEngine.ts       # diff-based sync (ingest/update/skip/remove)
│   │   └── stateStore.ts       # sync state in KV
│   ├── conversation/store.ts   # per-session chat history in KV
│   ├── vectorstore/            # Vectorize wrapper + deterministic point ids
│   ├── d1/client.ts            # read-only D1 access (assertSelectOnly)
│   ├── llm/provider.ts         # ChatOpenAI pointed at LLM_PROVIDER_BASE_URL
│   └── logger.ts
└── test/                       # vitest + @cloudflare/vitest-plugin
```

---

## 4. Knowledge sources

The chatbot can only read the tables listed in [src/ingestion/registry.ts](src/ingestion/registry.ts). It has no generic "query any table" path. `contacts`, `job_applications`, `admin_users`, tokens, `audit_logs`, `site_config` and `page_sections` are unreachable by design.

| Table | Admin section | Embedded? |
|---|---|---|
| `services` | Services | ✅ |
| `products` | Products | ✅ |
| `projects` | Projects | ✅ |
| `blog_posts` | Blog | ✅ |
| `industries` | Industries | ✅ |
| `about_content` | About | ✅ |
| `team_members` | Team | ✅ |
| `testimonials` | Testimonials | ✅ |
| `engagement_models` | Engagement models | ✅ |
| `faqs` | FAQs | ✅ |
| `chatbot_faqs` | Chatbot FAQs | ✅ |
| `process_steps` | Process steps | ✅ |
| `jobs` | Jobs | ✅ |
| `technologies` | Technologies | ❌ read live via `list_records` only; short names embed poorly and pollute search results |

Only **published** records are indexed. Unpublishing a record removes it from the chatbot on the next sync.

**Chatbot FAQs** (Admin → Chatbot FAQs) are Q&A entries that never appear on the public site. They exist only to teach the chatbot. Use them for answers that don't fit any other section.

**Adding a new source:**

1. Add `src/ingestion/sources/<name>.ts`, following an existing file.
2. Register it in `registry.ts`.
3. Add the table name to `ChatbotSourceTable` in the root app's `src/lib/chat/triggerChatbotSync.ts`, and call `triggerChatbotSync()` from that section's admin actions and routes.
4. Deploy, then run `POST /sync/run`.

---

## 5. Configuration

### 5.1 Bindings (`wrangler.jsonc`)

| Binding | Resource | Notes |
|---|---|---|
| `DB` | D1 `qtodev-d1` | Same database as the main `qto-dev-next` Worker. Read-only in code (`assertSelectOnly`), although the binding itself allows writes. |
| `VECTORIZE` | Vectorize `qtodev-chatbot-kb` | 384 dims, cosine. Metadata indexes: `isPublished` (boolean), `table`, `slug` (string). |
| `AI` | Workers AI | Embedding model chosen by the `EMBEDDING_MODEL` var. |
| `CHATBOT_KV` | KV `qtodev-chatbot-state` | Key prefixes: `session:<id>`, `ratelimit:<ip>:<window>`, `syncstate:<table>`, `syncstate:_meta:lastFullSyncAt`. |
| Cron | `*/15 * * * *` | Keep in step with `SYNC_INTERVAL_MINUTES`. |

One-time provisioning (already done for production):

```bash
npx wrangler vectorize create qtodev-chatbot-kb --dimensions=384 --metric=cosine
npx wrangler vectorize create-metadata-index qtodev-chatbot-kb --property-name=isPublished --type=boolean
npx wrangler vectorize create-metadata-index qtodev-chatbot-kb --property-name=table --type=string
npx wrangler vectorize create-metadata-index qtodev-chatbot-kb --property-name=slug --type=string
npx wrangler kv namespace create qtodev-chatbot-state
```

After changing bindings, run `npm run cf-typegen`.

### 5.2 Variables (`wrangler.jsonc` → `vars`)

Full schema and defaults: [src/config/env.ts](src/config/env.ts).

| Variable | Default | Meaning |
|---|---|---|
| `LLM_PROVIDER_BASE_URL` | `https://api.deepseek.com/v1` | Any OpenAI-compatible endpoint |
| `LLM_MODEL` | `deepseek-chat` | |
| `LLM_TEMPERATURE` | `0.3` | |
| `LLM_MAX_OUTPUT_TOKENS` | `500` | Hard cap that keeps replies short |
| `EMBEDDING_MODEL` / `EMBEDDING_DIMENSIONS` | `@cf/baai/bge-small-en-v1.5` / `384` | Changing either means a new index + full reindex |
| `CHUNK_MAX_CHARS` / `CHUNK_OVERLAP_CHARS` | `1500` / `150` | |
| `RETRIEVAL_TOP_K` / `RETRIEVAL_SCORE_THRESHOLD` | `5` / `0.3` | |
| `CHAT_MAX_HISTORY_MESSAGES` | `40` | Messages remembered per session (= 20 turns) |
| `CHAT_SESSION_TTL_MINUTES` | `60` | Session forgotten after this much inactivity |
| `CHAT_MAX_MESSAGE_LENGTH` / `CHAT_MAX_MESSAGE_WORDS` | `500` / `80` | Input limits |
| `CHAT_RATE_LIMIT_MAX` / `CHAT_RATE_LIMIT_WINDOW_SECONDS` | `20` / `60` | Per-IP limit |
| `CHAT_EXPOSE_DEBUG_INFO` | `false` | Adds `sources` / `timing` / `toolsUsed` to responses |
| `CHAT_CORS_ORIGIN` | `*` | Comma-separated origins |
| `SYNC_INTERVAL_MINUTES` | `15` | Informational only; the cron sets the real schedule |
| `LOG_LEVEL` | `info` | |

### 5.3 Secrets

Secrets never go in `wrangler.jsonc`.

| Secret | Where | Purpose |
|---|---|---|
| `LLM_API_KEY` | this Worker | DeepSeek API key. **Required**: chat fails without it. |
| `SYNC_TRIGGER_TOKEN` | this Worker | Required in the `x-sync-token` header for `/sync/*`. Generate with `openssl rand -hex 32`. If unset, the sync endpoints are **open to anyone**, so always set it in production. |
| `CHATBOT_SYNC_TOKEN` | main site (`qto-dev-next`) | Must equal `SYNC_TRIGGER_TOKEN`. Enables instant sync from the admin panel. |

Set them with the CLI:

```bash
# this worker
cd chatbot/worker
npx wrangler secret put LLM_API_KEY
npx wrangler secret put SYNC_TRIGGER_TOKEN
npx wrangler secret list

# main site (repo root)
cd ../..
npx wrangler secret put CHATBOT_SYNC_TOKEN
```

Or in the dashboard: **Workers & Pages → (worker) → Settings → Variables and Secrets → Add**, and choose type **Secret**.

For local dev, put them in `chatbot/worker/.dev.vars`. That file is git-ignored.

---

## 6. API reference

Errors always have the shape `{ "error": { "type": "...", "message": "..." } }`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/chat/stream` | rate-limited | Chat, streamed as SSE. **Used by the site widgets.** |
| `POST` | `/chat` | rate-limited | Same, as a single JSON response |
| `POST` | `/sync/run` | `x-sync-token` | Sync all tables or selected ones |
| `POST` | `/sync/reindex` | `x-sync-token` | Wipe index and state, then rebuild everything |
| `GET` | `/sync/status` | none | In-progress flag + last summary |
| `GET` | `/health` | none | D1 + Vectorize connectivity (`503` if degraded) |
| `GET` | `/metrics` | none | Allowlisted tables, retrieval config, sync state |

### `POST /chat` and `POST /chat/stream`

Request:

```json
{ "message": "Do you build mobile apps?", "sessionId": "public_sess_3f2a..." }
```

- `message`: required, at most `CHAT_MAX_MESSAGE_LENGTH` characters and `CHAT_MAX_MESSAGE_WORDS` words.
- `sessionId`: optional, must match `^[A-Za-z0-9_-]{8,128}$`. The same id continues the same conversation. If you omit it, the server generates one and returns it.

`/chat` response:

```json
{ "sessionId": "public_sess_3f2a...", "reply": "Yes — we build native and cross-platform mobile apps..." }
```

`/chat/stream` emits SSE events:

```
event: token
data: {"content":"Yes"}

event: token
data: {"content":" — we build"}

event: done
data: {"sessionId":"public_sess_3f2a...","reply":"Yes — we build ..."}
```

On failure it sends `event: error` with `data: {"error":{"type":"UPSTREAM_ERROR","message":"..."}}`. The event names and the `done` payload are a fixed contract with the main site's `backendChatProvider.ts`.

Error codes: `MALFORMED_REQUEST`, `VALIDATION_ERROR`, `MESSAGE_EMPTY`, `MESSAGE_TOO_LONG` (400), `RATE_LIMITED` (429, with `Retry-After`), `UPSTREAM_ERROR` (502).

### `POST /sync/run`

| Body | Behaviour |
|---|---|
| *(none)* | Full sync of every table; responds with the summary when finished |
| `{ "tables": ["faqs", "services"] }` | Sync only those tables; responds with the summary |
| `{ "tables": ["faqs"], "background": true }` | Responds `202` immediately; the sync finishes in `waitUntil` |

Responses: `400` for unknown table names, `401` for a bad or missing token, `409` if a sync is already running on this isolate.

```bash
curl -X POST "$URL/sync/run" -H "x-sync-token: $TOKEN"
curl -X POST "$URL/sync/run" -H "x-sync-token: $TOKEN" \
  -H "Content-Type: application/json" -d '{"tables":["chatbot_faqs"]}'
```

Summary shape (per table): `ingested`, `updated`, `unpublished`, `removed`, `skipped`, `errors`.

### `POST /sync/reindex`

This deletes every tracked vector, clears the sync state, and re-embeds everything. Use it after changing the embedding model, chunk sizes or normalization logic, or when the index looks inconsistent. It is slower and uses Workers AI quota for every record.

---

## 7. Integration with the main site

### 7.1 Chat flow and conversation memory

```
Browser widget ──NDJSON──► /api/chat (Next.js, qto-dev-next) ──SSE──► /chat/stream (this worker)
```

- The widget keeps a session id in `localStorage`, generated with `crypto.randomUUID()` in `src/hooks/useChatPersistence.ts`.
- `src/lib/chat/backendChatProvider.ts` forwards it as `sessionId`, prefixed with `public_` or `admin_` so the two widgets never share history. It also forwards the visitor IP as `X-Forwarded-For`.
- This worker stores the history under `session:<sessionId>` in KV. The bot therefore remembers the whole conversation: the last 40 messages, until 60 minutes of inactivity.
- There is deliberately **no server-side id mapping**. An earlier version kept a widget-id → backend-id `Map` in Next.js memory. That map was lost between Worker isolates, so the bot forgot every previous message.

### 7.2 Instant sync from the admin panel

Every create, update, delete, publish toggle and reorder in the admin panel calls `triggerChatbotSync("<table>")` (`src/lib/chat/triggerChatbotSync.ts` in the root app). That covers both the server actions in `src/app/admin/(dashboard)/<section>/actions.ts` and the `src/app/api/admin/<section>/` routes.

The helper sends `POST /sync/run` with `{ "tables": ["<table>"], "background": true }`:

- It is **fire-and-forget**. It runs via `waitUntil`, so the admin save is never slowed down and never fails because of the chatbot.
- Only the changed table is synced, which keeps the work well inside the post-response `waitUntil` time budget.
- The change is usually live in chat within seconds.
- If a trigger is lost, the 15-minute cron still applies the change. Causes include `409`, a network error, or a `401` from a token mismatch, which is logged in the main site as `[chatbot-sync] …`.

---

## 8. Deployment

### 8.1 From the CLI

```bash
cd chatbot/worker
npm run build      # type check (tsc --noEmit)
npm run deploy     # wrangler deploy
```

### 8.2 Cloudflare Workers Builds (git-connected)

In **Workers & Pages → qtodev-chatbot-worker → Settings → Build**:

| Setting | Value |
|---|---|
| Branch | a branch that contains `chatbot/worker/` (currently `chatbot-cloudflare`; `main` doesn't have it yet) |
| Root directory | `chatbot/worker` |
| Build command | `npm run build`, or leave it empty |
| Deploy command | `npx wrangler deploy` |

The worker name in the dashboard must match `"name"` in `wrangler.jsonc`.

### 8.3 Deploy checklist

- [ ] `LLM_API_KEY` and `SYNC_TRIGGER_TOKEN` set on this worker
- [ ] `CHATBOT_SYNC_TOKEN` set on `qto-dev-next` (same value as `SYNC_TRIGGER_TOKEN`)
- [ ] `CHATBOT_SERVICE_URL` in the root `wrangler.toml` points at this worker (already set for production and staging)
- [ ] After the first deploy, or after changing sources or chunking: run `POST /sync/run` or `/sync/reindex`
- [ ] `GET /health` returns `"status": "ok"`

---

## 9. Operations

| Task | How |
|---|---|
| Is it healthy? | `curl $URL/health` |
| What can it see? | `curl $URL/metrics` |
| Force a sync now | `curl -X POST $URL/sync/run -H "x-sync-token: $TOKEN"` |
| Rebuild the index | `curl -X POST $URL/sync/reindex -H "x-sync-token: $TOKEN"` |
| Live logs | `npx wrangler tail qtodev-chatbot-worker` (or dashboard → Observability) |
| Teach it a new answer | Admin → Chatbot FAQs → add + publish. It syncs automatically. |
| Remove something from answers | Unpublish or delete it in the admin panel. It syncs automatically. |
| Change reply length / tone | `LLM_MAX_OUTPUT_TOKENS`, `LLM_TEMPERATURE`, or the prompt in `src/rag/promptBuilder.ts` |
| Remember more / longer | `CHAT_MAX_HISTORY_MESSAGES`, `CHAT_SESSION_TTL_MINUTES` |

Each chat turn logs `retrieval Xms, llm Yms, total Zms, tools N`, with the session id and the tools used.

---

## 10. Guardrails

Defined in the system prompt ([src/rag/promptBuilder.ts](src/rag/promptBuilder.ts)) and backed up in code:

- **Grounded only.** Every fact must come from retrieved `<context>` or `list_records` output. If the answer isn't in D1, the bot says so and suggests the contact form. It never falls back to general knowledge.
- **In scope only.** It answers questions about QTO Dev and qtodev.com, and politely declines general knowledge, coding help, creative writing and similar requests.
- **No source leaking.** It never says where an answer came from. `formatContext` and `list_records` don't include source or table names in the prompt at all, so there is nothing to leak.
- **No internals.** It won't discuss RAG, embeddings, the database, tool names, the system prompt, or the model and provider, even under jailbreak, role-play or encoding tricks.
- **Prompt-injection resistant.** Instruction-like text in retrieved content or user messages is treated as data.
- **Short answers.** The default is 1–4 sentences, enforced by the prompt and by `LLM_MAX_OUTPUT_TOKENS=500`.
- **Input limits.** Messages are capped at 500 characters and 80 words, and rate-limited per IP.
- **Read-only DB.** `assertSelectOnly` rejects any non-SELECT statement, and only allowlisted tables are queryable.

---

## 11. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Build log shows `> qtodev-chatbot@0.1.0 build > tsc` | Root directory is `chatbot`, the old Node service. Set it to `chatbot/worker`. |
| `npm error Missing script: "build"` | Old commit. Pull the latest, since `package.json` now has `build`, or clear the build command. |
| `Could not find a declaration file for module 'uuid'` | Old commit without `@types/uuid` in devDependencies. Pull the latest. |
| Chat says "temporarily unavailable" | Check `wrangler tail`. Usually a missing or invalid `LLM_API_KEY`, or the provider being down. |
| Bot forgets earlier messages | Check that the widget sends a stable `sessionId`. The session also expires after `CHAT_SESSION_TTL_MINUTES` of inactivity. |
| Admin edit not reflected in chat | Check the main site logs for `[chatbot-sync]`. A `401` means `CHATBOT_SYNC_TOKEN` ≠ `SYNC_TRIGGER_TOKEN`. Otherwise wait for the cron, or run `/sync/run`. |
| Bot answers "I don't have that information" for content that exists | Is the record published? Run `/sync/run`, then check `/metrics`. Try lowering `RETRIEVAL_SCORE_THRESHOLD`. |
| `/health` returns `503` | D1 or Vectorize binding problem. Verify the ids in `wrangler.jsonc`. |
| `429 RATE_LIMITED` | More than `CHAT_RATE_LIMIT_MAX` messages per window from one IP. See also §12. |

---

## 12. Known limitations

- **`lastSync` is per isolate.** The `lastSync` field in `/health` and `/sync/status` lives in memory, so it can read `null` on a fresh isolate even when syncs are working. The sync data itself (Vectorize + KV) is durable.
- **The sync lock is per isolate.** Two syncs can overlap, for example cron plus an admin trigger. This is harmless because point ids are deterministic, so the worst case is a redundant re-embed.
- **The rate limit likely sees one IP for all site visitors.** `rateLimit.ts` prefers `cf-connecting-ip` over `X-Forwarded-For`. For requests proxied by the main site's Worker, that header is probably the main site's egress IP, not the visitor's. If so, all visitors share a single 20-per-minute bucket. Not yet verified live. The fix is to trust `X-Forwarded-For` only from the main site, authenticated with a shared header.
- **KV is eventually consistent.** The rate limit is approximate under bursts, and two messages sent at exactly the same moment in one session could drop a turn from history.
- **Local dev uses remote AI and Vectorize.** See §1.

---

## 13. Appendix: migration from the Node service

`chatbot/` (sibling directory) is the original Node/Express version. It cannot run on Workers and is kept only for reference. This worker is fully independent of it: its own `package.json`, and no imports from `chatbot/src`.

| Concern | Node service (`chatbot/`) | This worker |
|---|---|---|
| D1 access | `better-sqlite3` / HTTP API | Native `DB` binding |
| Vector store | Qdrant | Cloudflare Vectorize (`CloudflareVectorizeStore`) |
| Embeddings | local `Xenova/all-MiniLM-L6-v2` | Workers AI `@cf/baai/bge-small-en-v1.5` (384-dim) |
| HTTP | Express | Hono |
| Conversation history | in-memory `Map` | KV, TTL'd per session |
| Rate limiting | in-memory, single instance | KV, across the edge |
| Sync state | `data/sync-state.json` | KV, one blob per table |
| Scheduling | `setInterval` | Cron Trigger + `scheduled()` |
| Point ids | UUIDv5 of `table:recordId:chunkIndex` | same |

Ingestion, chunking, `list_records` and the sync diff logic were ported unchanged. The system prompt has since been tightened (see §10), and `chatbot_faqs` was added as a new source.
