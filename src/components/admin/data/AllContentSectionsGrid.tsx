"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, LayoutGrid, RefreshCw, type LucideIcon } from "lucide-react"
import { contentSections } from "@/config/content-sections"
import type { DashboardSectionStat, DashboardStatsResponse } from "@/lib/admin/dashboardStats"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const GRID_CLASS =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"

const SKELETON_TILE_COUNT = 12

function SectionsGridSkeleton() {
  return (
    <div className={GRID_CLASS} aria-hidden>
      {Array.from({ length: SKELETON_TILE_COUNT }).map((_, i) => (
        <div
          key={i}
          className="min-h-11 flex flex-col gap-2 rounded-xl border border-border bg-card px-3 py-3 shadow-[var(--admin-shadow-sm)]"
        >
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>
  )
}

type TileMode = "normal" | "empty" | "settings"

function tileMode(count: number | null): TileMode {
  if (count === null) return "settings"
  if (count === 0) return "empty"
  return "normal"
}

function SectionTile({
  section,
  icon: Icon,
  label,
  href,
}: {
  section: DashboardSectionStat
  icon: LucideIcon
  label: string
  href: string
}) {
  const mode = tileMode(section.count)

  return (
    <Link
      href={href}
      className={cn(
        "group min-h-11 flex flex-col gap-2 rounded-xl border bg-card px-3 py-3",
        "shadow-[var(--admin-shadow-sm)] transition-all duration-150",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--admin-shadow-md)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        mode === "empty" && "border-dashed border-border/70 bg-muted/20",
        mode === "settings" && "border-border/80 bg-muted/25",
        mode === "normal" && "border-border"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          mode === "empty" || mode === "settings"
            ? "bg-muted text-muted-foreground/70 group-hover:bg-primary/10 group-hover:text-primary"
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <span
        className={cn(
          "text-xs font-medium truncate w-full transition-colors",
          mode === "empty" || mode === "settings"
            ? "text-muted-foreground group-hover:text-primary"
            : "text-foreground group-hover:text-primary"
        )}
      >
        {label}
      </span>

      {mode === "settings" ? (
        <span className="inline-flex w-fit items-center rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Manage
        </span>
      ) : (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span
            className={cn(
              "text-lg font-bold tabular-nums leading-none",
              mode === "empty" ? "text-muted-foreground/50" : "text-muted-foreground"
            )}
          >
            {section.count}
          </span>
          {mode === "empty" ? (
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
              Empty
            </span>
          ) : section.published !== null ? (
            <span className="text-[10px] text-muted-foreground/70 tabular-nums truncate">
              {section.published} / {section.count} live
            </span>
          ) : null}
        </div>
      )}
    </Link>
  )
}

export default function AllContentSectionsGrid() {
  const [sections, setSections] = useState<DashboardSectionStat[] | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const registryByKey = useMemo(
    () => new Map(contentSections.map((s) => [s.key, s])),
    []
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch("/api/admin/dashboard/stats", { credentials: "include" })
      const body = (await res.json().catch(() => null)) as
        | { success: boolean; details?: DashboardStatsResponse }
        | null
      if (!res.ok || !body?.success || !body.details) {
        setError(true)
        return
      }
      setSections(body.details.sections)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <SectionsGridSkeleton />

  if (error || !sections) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-start gap-3 shadow-[var(--admin-shadow-sm)]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-[var(--admin-warning)]" />
          Couldn&apos;t load content sections.
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={GRID_CLASS}>
      {sections.map((section) => {
        const registry = registryByKey.get(section.key)
        const Icon = registry?.icon ?? LayoutGrid
        const label = registry?.label ?? section.label
        const href = registry?.href ?? section.href

        return (
          <SectionTile
            key={section.key}
            section={section}
            icon={Icon}
            label={label}
            href={href}
          />
        )
      })}
    </div>
  )
}
