import { prisma } from "@/lib/prisma"
import { parseMetadata } from "@/lib/metadata"
import { AUDIT_ACTIONS, CONTENT_AUDIT_ACTIONS } from "@/lib/auth/auditActions"

export type RecentActivityAction = "created" | "updated" | "published" | "deleted"

export interface RecentActivityActor {
  name: string
  email: string | null
}

export interface RecentActivityItem {
  id: string
  label: string
  section: string
  action: RecentActivityAction
  /** ISO timestamp of when the activity happened. */
  at: string
  actor?: RecentActivityActor | null
  /** Link to the underlying record, or null when it no longer exists (deleted / unknown). */
  href?: string | null
}

const DEFAULT_LIMIT = 10
const MIN_LIMIT = 1
const MAX_LIMIT = 50

/** Shape of the structured metadata written by writeContentAudit. */
interface ContentAuditMetadata {
  section?: string
  entityId?: string
  label?: string | null
}

const AUDIT_ACTION_TO_KIND: Record<string, RecentActivityAction> = {
  [AUDIT_ACTIONS.CONTENT_CREATED]: "created",
  [AUDIT_ACTIONS.CONTENT_UPDATED]: "updated",
  [AUDIT_ACTIONS.CONTENT_PUBLISHED]: "published",
  [AUDIT_ACTIONS.CONTENT_DELETED]: "deleted",
}

function clampLimit(limit: number): number {
  if (!Number.isFinite(limit)) return DEFAULT_LIMIT
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, Math.trunc(limit)))
}

function dedupeKey(section: string, entityId: string): string {
  return `${section}:${entityId}`
}

function buildHref(section: string, entityId: string, action: RecentActivityAction): string | null {
  if (action === "deleted" || !section || !entityId) return null
  return `/admin/${section}/${entityId}`
}

/**
 * Read the most recent structured content-mutation events from AuditLog,
 * keyed by section+entityId (most-recent event per record wins). Skips entries
 * whose metadata lacks section/entityId (older/non-content logs).
 */
async function getAuditActivity(limit: number): Promise<Map<string, RecentActivityItem>> {
  const rows = await prisma.auditLog.findMany({
    where: { action: { in: [...CONTENT_AUDIT_ACTIONS] } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { displayName: true, email: true } } },
  })

  const byKey = new Map<string, RecentActivityItem>()
  for (const row of rows) {
    const meta = parseMetadata<ContentAuditMetadata>(row.metadata)
    const section = meta?.section
    const entityId = meta?.entityId
    if (!section || !entityId) continue

    const key = dedupeKey(section, entityId)
    // Rows are newest-first, so the first occurrence is the latest event.
    if (byKey.has(key)) continue

    const action = AUDIT_ACTION_TO_KIND[row.action] ?? "updated"
    const actor: RecentActivityActor | null = row.user
      ? { name: row.user.displayName ?? row.user.email, email: row.user.email }
      : null

    byKey.set(key, {
      id: `audit-${row.id}`,
      label: meta?.label?.trim() || "Untitled",
      section,
      action,
      at: new Date(row.createdAt).toISOString(),
      actor,
      href: buildHref(section, entityId, action),
    })
  }
  return byKey
}

/**
 * Legacy fallback: sample the most recently touched records per model using
 * `updatedAt`. Keeps the feed populated for records changed before content
 * audit logging existed. Internal detail — drop once AuditLog has enough history.
 */
async function getLegacyActivity(limit: number): Promise<Map<string, RecentActivityItem>> {
  const [services, blog, projects, team] = await Promise.all([
    prisma.service.findMany({ orderBy: { updatedAt: "desc" }, take: limit, select: { id: true, title: true, updatedAt: true } }),
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take: limit, select: { id: true, title: true, updatedAt: true } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: limit, select: { id: true, title: true, updatedAt: true } }),
    prisma.teamMember.findMany({ orderBy: { updatedAt: "desc" }, take: limit, select: { id: true, name: true, updatedAt: true } }),
  ])

  const byKey = new Map<string, RecentActivityItem>()
  const add = (section: string, id: string, label: string, updatedAt: Date) => {
    byKey.set(dedupeKey(section, id), {
      id: `${section}-${id}`,
      label,
      section,
      action: "updated",
      at: new Date(updatedAt).toISOString(),
      actor: null,
      href: buildHref(section, id, "updated"),
    })
  }

  services.forEach((r) => add("services", r.id, r.title, r.updatedAt))
  blog.forEach((r) => add("blog", r.id, r.title, r.updatedAt))
  projects.forEach((r) => add("projects", r.id, r.title, r.updatedAt))
  team.forEach((r) => add("team", r.id, r.name, r.updatedAt))
  return byKey
}

/**
 * Recent admin content activity, primarily from AuditLog (true create/update/
 * delete/publish history with actor) merged with a legacy `updatedAt` backfill.
 * De-duped by section+entityId (audit wins), sorted newest-first, sliced to `limit`.
 */
export async function getRecentActivity({
  limit = DEFAULT_LIMIT,
}: { limit?: number } = {}): Promise<RecentActivityItem[]> {
  const clamped = clampLimit(limit)

  const [auditByKey, legacyByKey] = await Promise.all([
    getAuditActivity(clamped),
    getLegacyActivity(clamped),
  ])

  // Start from the legacy sample, then let audit entries win for the same record.
  const merged = new Map<string, RecentActivityItem>(legacyByKey)
  for (const [key, item] of auditByKey) {
    merged.set(key, item)
  }

  return Array.from(merged.values())
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, clamped)
}
