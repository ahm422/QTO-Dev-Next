import { beforeEach, describe, expect, it, vi } from "vitest"
import { getRecentActivity } from "@/lib/admin/recentActivity"
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: { findMany: vi.fn() },
    service: { findMany: vi.fn() },
    blogPost: { findMany: vi.fn() },
    project: { findMany: vi.fn() },
    teamMember: { findMany: vi.fn() },
  },
}))

// Imported after the mock is registered.
import { prisma } from "@/lib/prisma"

type AuditRow = {
  id: string
  action: string
  metadata: string | null
  createdAt: Date
  user: { displayName: string | null; email: string } | null
}

const mocked = prisma as unknown as {
  auditLog: { findMany: ReturnType<typeof vi.fn> }
  service: { findMany: ReturnType<typeof vi.fn> }
  blogPost: { findMany: ReturnType<typeof vi.fn> }
  project: { findMany: ReturnType<typeof vi.fn> }
  teamMember: { findMany: ReturnType<typeof vi.fn> }
}

function auditRow(
  overrides: Partial<Omit<AuditRow, "metadata">> & { metadata: Record<string, unknown> | null }
): AuditRow {
  const { metadata, ...rest } = overrides
  return {
    id: "a1",
    action: AUDIT_ACTIONS.CONTENT_UPDATED,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    user: null,
    ...rest,
    metadata: metadata === null ? null : JSON.stringify(metadata),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  // Legacy backfill sources default to empty; individual tests override as needed.
  mocked.auditLog.findMany.mockResolvedValue([])
  mocked.service.findMany.mockResolvedValue([])
  mocked.blogPost.findMany.mockResolvedValue([])
  mocked.project.findMany.mockResolvedValue([])
  mocked.teamMember.findMany.mockResolvedValue([])
})

describe("getRecentActivity", () => {
  it("maps an audit row into a RecentActivityItem with actor, action kind and href", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({
        id: "audit-1",
        action: AUDIT_ACTIONS.CONTENT_CREATED,
        createdAt: new Date("2026-02-01T10:00:00.000Z"),
        metadata: { section: "services", entityId: "svc-1", label: "SEO Audit" },
        user: { displayName: "Jane Admin", email: "jane@example.com" },
      }),
    ])

    const [item] = await getRecentActivity({ limit: 10 })

    expect(item).toMatchObject({
      label: "SEO Audit",
      section: "services",
      action: "created",
      at: "2026-02-01T10:00:00.000Z",
      actor: { name: "Jane Admin", email: "jane@example.com" },
      href: "/admin/services/svc-1",
    })
  })

  it("falls back to email when displayName is missing, and null actor when no user", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({
        id: "x1",
        metadata: { section: "blog", entityId: "b1", label: "Post" },
        user: { displayName: null, email: "editor@example.com" },
      }),
      auditRow({
        id: "x2",
        metadata: { section: "projects", entityId: "p1", label: "Proj" },
        user: null,
      }),
    ])

    const items = await getRecentActivity({ limit: 10 })
    expect(items.find((i) => i.section === "blog")?.actor).toEqual({
      name: "editor@example.com",
      email: "editor@example.com",
    })
    expect(items.find((i) => i.section === "projects")?.actor).toBeNull()
  })

  it("returns null href for deleted records", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({
        id: "d1",
        action: AUDIT_ACTIONS.CONTENT_DELETED,
        metadata: { section: "team", entityId: "t1", label: "Ex Member" },
      }),
    ])

    const [item] = await getRecentActivity({ limit: 10 })
    expect(item.action).toBe("deleted")
    expect(item.href).toBeNull()
  })

  it("skips audit rows whose metadata lacks section/entityId or is null", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({ id: "n1", metadata: null }),
      auditRow({ id: "n2", metadata: { label: "no ids" } }),
      auditRow({ id: "ok", metadata: { section: "services", entityId: "s9", label: "Good" } }),
    ])

    const items = await getRecentActivity({ limit: 10 })
    expect(items).toHaveLength(1)
    expect(items[0].section).toBe("services")
  })

  it("keeps only the most recent audit event per section+entityId", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({
        id: "latest",
        action: AUDIT_ACTIONS.CONTENT_UPDATED,
        createdAt: new Date("2026-03-02T00:00:00.000Z"),
        metadata: { section: "services", entityId: "svc-1", label: "V2" },
      }),
      auditRow({
        id: "older",
        action: AUDIT_ACTIONS.CONTENT_CREATED,
        createdAt: new Date("2026-03-01T00:00:00.000Z"),
        metadata: { section: "services", entityId: "svc-1", label: "V1" },
      }),
    ])

    const items = await getRecentActivity({ limit: 10 })
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ action: "updated", label: "V2" })
  })

  it("merges legacy backfill and lets audit win for the same record", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({
        id: "svc-audit",
        action: AUDIT_ACTIONS.CONTENT_UPDATED,
        createdAt: new Date("2026-04-05T00:00:00.000Z"),
        metadata: { section: "services", entityId: "svc-1", label: "Audited Service" },
        user: { displayName: "Bob", email: "bob@example.com" },
      }),
    ])
    // svc-1 also appears in the legacy sample (should be overridden by audit),
    // svc-2 only exists in legacy (should be kept as backfill).
    mocked.service.findMany.mockResolvedValue([
      { id: "svc-1", title: "Legacy Service", updatedAt: new Date("2026-04-01T00:00:00.000Z") },
      { id: "svc-2", title: "Only Legacy", updatedAt: new Date("2026-04-03T00:00:00.000Z") },
    ])

    const items = await getRecentActivity({ limit: 10 })
    expect(items).toHaveLength(2)
    // Newest first: the audited svc-1 (Apr 5) before legacy svc-2 (Apr 3).
    expect(items[0]).toMatchObject({ section: "services", label: "Audited Service", actor: { name: "Bob" } })
    expect(items[1]).toMatchObject({ section: "services", label: "Only Legacy", action: "updated", actor: null })
  })

  it("sorts merged results by timestamp descending", async () => {
    mocked.auditLog.findMany.mockResolvedValue([
      auditRow({ id: "a", createdAt: new Date("2026-05-01T00:00:00.000Z"), metadata: { section: "blog", entityId: "b1", label: "old" } }),
    ])
    mocked.project.findMany.mockResolvedValue([
      { id: "p1", title: "new project", updatedAt: new Date("2026-06-01T00:00:00.000Z") },
    ])

    const items = await getRecentActivity({ limit: 10 })
    expect(items.map((i) => i.label)).toEqual(["new project", "old"])
  })

  it("builds legacy team href and label from the name field", async () => {
    mocked.teamMember.findMany.mockResolvedValue([
      { id: "t1", name: "Alice", updatedAt: new Date("2026-01-10T00:00:00.000Z") },
    ])

    const [item] = await getRecentActivity({ limit: 10 })
    expect(item).toMatchObject({ section: "team", label: "Alice", href: "/admin/team/t1", action: "updated" })
  })

  describe("limit clamping", () => {
    it("clamps below the minimum up to 1", async () => {
      await getRecentActivity({ limit: 0 })
      expect(mocked.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 1 }))
    })

    it("clamps above the maximum down to 50", async () => {
      await getRecentActivity({ limit: 1000 })
      expect(mocked.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }))
    })

    it("defaults to 10 for missing or non-finite limits", async () => {
      await getRecentActivity()
      expect(mocked.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10 }))

      vi.clearAllMocks()
      mocked.auditLog.findMany.mockResolvedValue([])
      mocked.service.findMany.mockResolvedValue([])
      mocked.blogPost.findMany.mockResolvedValue([])
      mocked.project.findMany.mockResolvedValue([])
      mocked.teamMember.findMany.mockResolvedValue([])
      await getRecentActivity({ limit: Number.NaN })
      expect(mocked.auditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 10 }))
    })

    it("slices the merged result to the clamped limit", async () => {
      mocked.auditLog.findMany.mockResolvedValue([
        auditRow({ id: "a", createdAt: new Date("2026-01-03"), metadata: { section: "blog", entityId: "b1", label: "one" } }),
      ])
      mocked.service.findMany.mockResolvedValue([
        { id: "s1", title: "two", updatedAt: new Date("2026-01-02") },
        { id: "s2", title: "three", updatedAt: new Date("2026-01-01") },
      ])

      const items = await getRecentActivity({ limit: 2 })
      expect(items).toHaveLength(2)
      expect(items.map((i) => i.label)).toEqual(["one", "two"])
    })
  })
})
