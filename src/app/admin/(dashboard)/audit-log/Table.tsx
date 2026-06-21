"use client"

import { useState } from "react"
import ActionBadge from "./ActionBadge"

type AuditLogRow = {
  id: string
  action: string
  email: string | null
  ip: string | null
  userAgent: string | null
  metadata: unknown
  createdAt: Date
  user: { id: string; email: string; displayName: string | null } | null
}

function formatRelative(date: Date) {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

function MetadataCell({ metadata }: { metadata: unknown }) {
  const [open, setOpen] = useState(false)
  const obj = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata as Record<string, unknown> : null
  if (!obj || Object.keys(obj).length === 0) return <span className="text-muted-foreground text-xs">—</span>
  const metadata2 = obj

  const preview = Object.entries(metadata2)
    .slice(0, 2)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(", ")

  return (
    <div className="max-w-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-muted-foreground hover:text-foreground text-left truncate w-full"
      >
        {open ? "▾" : "▸"} {preview}
        {Object.keys(metadata2).length > 2 && !open ? " …" : ""}
      </button>
      {open && (
        <pre className="mt-1 text-xs bg-muted rounded p-2 max-h-40 overflow-auto whitespace-pre-wrap break-all">
          {JSON.stringify(metadata2, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default function AuditLogTable({ rows }: { rows: AuditLogRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground text-sm">
        No audit log entries match your filters.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">IP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-xs tabular-nums text-foreground">
                    {new Date(row.createdAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatRelative(row.createdAt)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ActionBadge action={row.action} />
                </td>
                <td className="px-4 py-3">
                  {row.user ? (
                    <div>
                      {row.user.displayName && (
                        <div className="text-xs font-medium text-foreground">{row.user.displayName}</div>
                      )}
                      <div className="text-xs text-muted-foreground">{row.user.email}</div>
                    </div>
                  ) : row.email ? (
                    <div className="text-xs text-muted-foreground">{row.email}</div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-muted-foreground">{row.ip ?? "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <MetadataCell metadata={row.metadata} />
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  <span
                    className="text-xs text-muted-foreground truncate block"
                    title={row.userAgent ?? undefined}
                  >
                    {row.userAgent ?? "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
