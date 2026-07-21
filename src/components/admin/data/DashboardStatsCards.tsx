"use client"

import { useCallback, useEffect, useState } from "react"
import { Briefcase, GitBranch, BookOpen, FolderKanban, Activity, AlertTriangle, RefreshCw } from "lucide-react"
import StatCard from "@/components/admin/data/StatCard"
import StatCardGrid from "@/components/admin/data/StatCardGrid"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardStatsResponse } from "@/lib/admin/dashboardStats"

/** Score at/above which Content Health is considered healthy. */
const HEALTH_GOOD_THRESHOLD = 75

function healthBadge(score: number): { label: string; variant: "success" | "warning" } {
  return score >= HEALTH_GOOD_THRESHOLD
    ? { label: "Good", variant: "success" }
    : { label: "Needs attention", variant: "warning" }
}

function StatCardsSkeleton() {
  return (
    <StatCardGrid cols={5}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-3 md:p-5 flex flex-col gap-3 shadow-[var(--admin-shadow-sm)]"
        >
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </StatCardGrid>
  )
}

export default function DashboardStatsCards() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

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
      setStats(body.details)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <StatCardsSkeleton />

  if (error || !stats) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-card p-5 flex flex-col items-start gap-3 shadow-[var(--admin-shadow-sm)]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-[var(--admin-warning)]" />
          Couldn&apos;t load dashboard stats.
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

  const sectionByKey = new Map(stats.sections.map((s) => [s.key, s]))
  const countOf = (key: string) => sectionByKey.get(key)?.count ?? 0
  const publishedOf = (key: string) => sectionByKey.get(key)?.published ?? 0
  const ratio = (part: number, total: number) => (part / Math.max(1, total)) * 100

  const servicesTotal = countOf("services")
  const servicesPublished = publishedOf("services")
  const processStepsTotal = countOf("process-steps")
  const processStepsPublished = publishedOf("process-steps")
  const blogTotal = countOf("blog")
  const blogPublished = publishedOf("blog")
  const projectsTotal = countOf("projects")
  const projectsPublished = publishedOf("projects")

  const { health } = stats
  const badge = healthBadge(health.score)
  const healthTooltip =
    `Publish completeness ${health.publishCompleteness}% (weight ${Math.round(health.weights.publish * 100)}%) · ` +
    `Section completeness ${health.sectionCompleteness}% (weight ${Math.round(health.weights.sections * 100)}%) · ` +
    `Field completeness ${health.fieldCompleteness}% (weight ${Math.round(health.weights.fields * 100)}%)`

  return (
    <StatCardGrid cols={5}>
      <StatCard label="Total Services" value={servicesTotal} icon={Briefcase} badge={`${servicesPublished} live`} badgeVariant="success" progress={ratio(servicesPublished, servicesTotal)} iconColor="primary" />
      <StatCard label="Process Steps" value={processStepsTotal} icon={GitBranch} badge={`${processStepsPublished} live`} badgeVariant="success" iconColor="blue" />
      <StatCard label="Blog Posts" value={blogTotal} icon={BookOpen} badge={`${blogPublished} live`} badgeVariant="info" progress={ratio(blogPublished, blogTotal)} iconColor="purple" />
      <StatCard label="Projects" value={projectsTotal} icon={FolderKanban} badge={`${projectsPublished} live`} badgeVariant="info" iconColor="teal" />
      <StatCard label="Content Health" value={`${health.score}%`} icon={Activity} badge={badge.label} badgeVariant={badge.variant} progress={health.score} iconColor="success" tooltip={healthTooltip} />
    </StatCardGrid>
  )
}
