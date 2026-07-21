"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AlertTriangle, RefreshCw, SlidersHorizontal, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { getAdminChartTheme } from "@/lib/admin/chartTheme"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { contentSections } from "@/config/content-sections"
import type {
  ActivityChartMetric,
  ActivityChartPoint,
  ActivityChartResponse,
  ActivityRange,
} from "@/lib/admin/activityChart"

const RANGE_STORAGE_KEY = "admin-activity-chart-range"
const METRICS_STORAGE_KEY = "admin-activity-chart-metrics"
const DEFAULT_METRIC_KEYS = ["services", "blog", "projects"]

/** All timestamped sections are eligible for the metric picker. */
const PICKER_OPTIONS = contentSections
  .filter((s) => s.hasTimestamps && s.model)
  .map((s) => ({ key: s.key, label: s.label }))

function readStoredRange(): ActivityRange {
  if (typeof window === "undefined") return "6m"
  return window.localStorage.getItem(RANGE_STORAGE_KEY) === "1y" ? "1y" : "6m"
}

function readStoredMetrics(): string[] {
  if (typeof window === "undefined") return DEFAULT_METRIC_KEYS
  const raw = window.localStorage.getItem(METRICS_STORAGE_KEY)
  if (!raw) return DEFAULT_METRIC_KEYS
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(
        (k): k is string => typeof k === "string" && PICKER_OPTIONS.some((o) => o.key === k)
      )
      return valid.length > 0 ? valid : DEFAULT_METRIC_KEYS
    }
  } catch {
    /* fall through to default */
  }
  return DEFAULT_METRIC_KEYS
}

type TooltipEntry = {
  dataKey?: string | number
  value?: number | string | Array<number | string>
  color?: string
  name?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  metrics: ActivityChartMetric[]
  hidden: Set<string>
  ct: ReturnType<typeof getAdminChartTheme>
}

function ChartTooltip({ active, payload, label, metrics, hidden, ct }: Readonly<ChartTooltipProps>) {
  if (!active || !payload || payload.length === 0) return null
  const metricByKey = new Map(metrics.map((m) => [m.key, m]))
  return (
    <div style={ct.tooltip.contentStyle}>
      <div style={{ ...ct.tooltip.labelStyle, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div className="flex flex-col gap-1">
        {payload
          .filter((entry) => entry.dataKey && !hidden.has(String(entry.dataKey)))
          .map((entry) => {
            const key = String(entry.dataKey)
            const metric = metricByKey.get(key)
            const value = typeof entry.value === "number" ? entry.value : 0
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-3"
                style={{ opacity: value === 0 ? 0.5 : 1 }}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: metric?.color ?? entry.color }}
                  />
                  {metric?.label ?? key}
                </span>
                <span className="tabular-nums font-medium">{value}</span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

function ChartSkeleton({ height }: Readonly<{ height: number }>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-28" />
      </div>
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  )
}

export default function ContentActivityChart() {
  const { theme } = useAdminTheme()
  const ct = getAdminChartTheme(theme)
  const isLg = useMediaQuery("(min-width: 1024px)")
  const chartHeight = isLg ? 260 : 190

  const [range, setRange] = useState<ActivityRange>("6m")
  const [metricKeys, setMetricKeys] = useState<string[]>(DEFAULT_METRIC_KEYS)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [data, setData] = useState<ActivityChartResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Hydrate persisted preferences on mount (client only).
  useEffect(() => {
    setRange(readStoredRange())
    setMetricKeys(readStoredMetrics())
  }, [])

  const load = useCallback(async () => {
    if (metricKeys.length === 0) {
      setData(null)
      setLoading(false)
      setError(false)
      return
    }
    setLoading(true)
    setError(false)
    try {
      const params = new URLSearchParams({ range, metrics: metricKeys.join(",") })
      const res = await fetch(`/api/admin/dashboard/activity-chart?${params.toString()}`, {
        credentials: "include",
      })
      const body = (await res.json().catch(() => null)) as
        | { success: boolean; details?: ActivityChartResponse }
        | null
      if (!res.ok || !body?.success || !body.details) {
        setError(true)
        return
      }
      setData(body.details)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [range, metricKeys])

  useEffect(() => {
    load()
  }, [load])

  const changeRange = useCallback((next: ActivityRange) => {
    setRange(next)
    if (typeof window !== "undefined") window.localStorage.setItem(RANGE_STORAGE_KEY, next)
  }, [])

  const toggleMetric = useCallback((key: string) => {
    setMetricKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      if (typeof window !== "undefined") {
        window.localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(next))
      }
      // Dropping a metric shouldn't leave it stuck in the hidden set.
      setHidden((h) => {
        if (!h.has(key)) return h
        const copy = new Set(h)
        copy.delete(key)
        return copy
      })
      return next
    })
  }, [])

  const metrics = useMemo(() => data?.metrics ?? [], [data])
  const points = useMemo<ActivityChartPoint[]>(() => data?.points ?? [], [data])

  // Click a legend item to isolate it; click the isolated item again to restore all.
  const onLegendClick = useCallback(
    (key: string) => {
      setHidden((prev) => {
        const visible = metrics.map((m) => m.key).filter((k) => !prev.has(k))
        const isOnlyVisible = visible.length === 1 && visible[0] === key
        if (isOnlyVisible) return new Set()
        return new Set(metrics.map((m) => m.key).filter((k) => k !== key))
      })
    },
    [metrics]
  )

  const hasActivity = useMemo(
    () =>
      metrics.some((m) =>
        points.some((p) => typeof p[m.key] === "number" && (p[m.key] as number) > 0)
      ),
    [metrics, points]
  )

  const rangeToggle = (
    <div className="flex items-center gap-1">
      {(["6m", "1y"] as const).map((r) => (
        <Button
          key={r}
          size="sm"
          variant={range === r ? "default" : "ghost"}
          onClick={() => changeRange(r)}
          className={
            range === r
              ? "h-7 px-3 text-xs bg-primary text-primary-foreground"
              : "h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
          }
        >
          {r === "6m" ? "6 months" : "1 year"}
        </Button>
      ))}
    </div>
  )

  const metricPicker = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground gap-1.5"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Metrics
          <span className="tabular-nums opacity-70">({metricKeys.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-72 w-52 overflow-y-auto">
        <DropdownMenuLabel>Metrics</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PICKER_OPTIONS.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.key}
            checked={metricKeys.includes(opt.key)}
            onCheckedChange={() => toggleMetric(opt.key)}
            onSelect={(e) => e.preventDefault()}
          >
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const controls = (
    <div className="flex items-center justify-between gap-2">
      {metricPicker}
      {rangeToggle}
    </div>
  )

  if (loading) return <ChartSkeleton height={chartHeight} />

  if (error) {
    return (
      <div className="space-y-4">
        {controls}
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card/50"
          style={{ height: chartHeight }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-[var(--admin-warning)]" />
            Couldn&apos;t load activity data.
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
      </div>
    )
  }

  const showEmpty = metricKeys.length === 0 || metrics.length === 0 || !hasActivity

  return (
    <div className="space-y-4">
      {controls}

      {showEmpty ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center"
          style={{ height: chartHeight }}
        >
          <BarChart2 className="h-6 w-6 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            {metricKeys.length === 0
              ? "Select at least one metric to display."
              : "No activity in this period."}
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart data={points} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                {metrics.map((m) => (
                  <linearGradient key={m.key} id={`activity-fill-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={m.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={ct.grid.stroke} vertical={false} />
              <XAxis dataKey="month" tick={ct.axis.tick} axisLine={false} tickLine={false} />
              <YAxis tick={ct.axis.tick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={<ChartTooltip metrics={metrics} hidden={hidden} ct={ct} />}
                cursor={{ stroke: ct.grid.stroke }}
              />
              {metrics.map((m) => (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  fill={`url(#activity-fill-${m.key})`}
                  hide={hidden.has(m.key)}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>

          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5"
            style={ct.legend.wrapperStyle}
          >
            {metrics.map((m) => {
              const isHidden = hidden.has(m.key)
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onLegendClick(m.key)}
                  className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                  style={{ opacity: isHidden ? 0.4 : 1 }}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: m.color }}
                  />
                  <span
                    style={{
                      textDecoration: isHidden ? "line-through" : "none",
                      color: "inherit",
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
