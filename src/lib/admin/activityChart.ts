import { contentSections } from "@/config/content-sections"
import { timeSeriesDelegates } from "@/lib/admin/sectionModels"

export type ActivityRange = "6m" | "1y"

export type ActivityChartMetric = {
  key: string
  label: string
  color: string
}

/**
 * One month bucket. `month`/`monthKey` are fixed; each selected metric key adds
 * a numeric field (zero-filled), e.g. `{ month: "Feb", monthKey: "2026-02", services: 2, blog: 4 }`.
 */
export type ActivityChartPoint = {
  month: string
  monthKey: string
} & Record<string, string | number>

export type ActivityChartResponse = {
  version: 1
  generatedAt: string
  range: ActivityRange
  metrics: ActivityChartMetric[]
  points: ActivityChartPoint[]
}

/** Default series shown when no valid metrics are requested. */
const DEFAULT_METRIC_KEYS = ["services", "blog", "projects"] as const

/** Max series rendered at once to keep the chart readable. */
const MAX_METRICS = 8

/**
 * Fallback palette (hex mirrors chartTheme dark defaults) for sections whose
 * registry entry has no explicit `color`. Cycled by index.
 */
const FALLBACK_PALETTE = [
  "#F97316",
  "#3B82F6",
  "#A855F7",
  "#06B6D4",
  "#22C55E",
  "#EAB308",
  "#EC4899",
  "#14B8A6",
] as const

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const

/** Sections eligible for the activity chart: hasTimestamps + a time-series delegate. */
function chartableSections() {
  return contentSections.filter(
    (s) => s.hasTimestamps && s.model && timeSeriesDelegates[s.model]
  )
}

/**
 * Normalize requested metric keys into resolved metrics (key/label/color).
 * Unknown or ineligible keys are dropped; empty input falls back to defaults;
 * result is de-duplicated and capped at MAX_METRICS.
 */
export function resolveMetrics(rawKeys: string[]): ActivityChartMetric[] {
  const eligible = chartableSections()
  const eligibleByKey = new Map(eligible.map((s) => [s.key, s]))

  const requested = rawKeys.map((k) => k.trim()).filter(Boolean)
  const candidateKeys = requested.filter((k) => eligibleByKey.has(k))
  const keys = (candidateKeys.length > 0 ? candidateKeys : [...DEFAULT_METRIC_KEYS])
    .filter((k) => eligibleByKey.has(k))

  const seen = new Set<string>()
  const metrics: ActivityChartMetric[] = []
  for (const key of keys) {
    if (seen.has(key)) continue
    seen.add(key)
    const section = eligibleByKey.get(key)!
    metrics.push({
      key: section.key,
      label: section.label,
      color: section.color ?? FALLBACK_PALETTE[metrics.length % FALLBACK_PALETTE.length],
    })
    if (metrics.length >= MAX_METRICS) break
  }
  return metrics
}

function toMonthKey(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

/**
 * Build N (6 or 12) zero-filled month buckets ending with the current month,
 * ordered oldest → newest, each seeded with 0 for every selected metric.
 */
function buildBuckets(months: number, metricKeys: string[]): ActivityChartPoint[] {
  const now = new Date()
  const buckets: ActivityChartPoint[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    const point: ActivityChartPoint = {
      month: MONTH_LABELS[d.getUTCMonth()],
      monthKey: toMonthKey(d),
    }
    for (const key of metricKeys) point[key] = 0
    buckets.push(point)
  }
  return buckets
}

/**
 * Computes real per-month content-creation counts from the DB.
 *
 * Uses `createdAt` as the time signal ("content created per month"). For each
 * metric we pull just `createdAt` for records within the window and bucket by
 * `YYYY-MM` in JS — SQLite-safe and ORM-portable. Months with no records stay
 * at 0 so the line/area has no gaps.
 */
export async function getActivityChart({
  range,
  metricKeys,
}: {
  range: ActivityRange
  metricKeys: string[]
}): Promise<ActivityChartResponse> {
  const months = range === "1y" ? 12 : 6
  const metrics = resolveMetrics(metricKeys)
  const resolvedKeys = metrics.map((m) => m.key)

  const points = buildBuckets(months, resolvedKeys)
  const pointByKey = new Map(points.map((p) => [p.monthKey, p]))

  const now = new Date()
  const windowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1))

  const sectionByKey = new Map(contentSections.map((s) => [s.key, s]))

  await Promise.all(
    metrics.map(async (metric) => {
      const model = sectionByKey.get(metric.key)?.model
      const delegate = model ? timeSeriesDelegates[model] : undefined
      if (!delegate) return
      const rows = await delegate.findMany({
        where: { createdAt: { gte: windowStart } },
        select: { createdAt: true },
      })
      for (const row of rows) {
        const bucket = pointByKey.get(toMonthKey(new Date(row.createdAt)))
        if (bucket) bucket[metric.key] = (bucket[metric.key] as number) + 1
      }
    })
  )

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    range,
    metrics,
    points,
  }
}
