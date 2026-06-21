import type { CSSProperties } from "react"

export type AdminTheme = "dark" | "light"

export interface AdminChartTheme {
  grid: { stroke: string }
  axis: { tick: { fill: string; fontSize: number } }
  tooltip: { contentStyle: CSSProperties; labelStyle: CSSProperties }
  legend: { wrapperStyle: CSSProperties }
  colors: { chart1: string; chart2: string; chart3: string; chart4: string; chart5: string }
}

/**
 * Reads resolved CSS variable values from the scoped .admin-dark / .admin-light element
 * and returns Recharts-compatible style objects. Call synchronously in render — re-runs
 * on every theme-triggered re-render so charts repaint immediately on toggle.
 *
 * Falls back to hardcoded dark-mode values if the DOM isn't available (SSR) or the
 * theme class isn't mounted yet, so charts never render with blank styles.
 */
export function getAdminChartTheme(theme: AdminTheme): AdminChartTheme {
  const root =
    typeof document !== "undefined"
      ? (document.querySelector(`.admin-${theme}`) as HTMLElement | null) ??
        document.documentElement
      : null

  function cssVar(name: string, fallback: string): string {
    if (!root) return fallback
    return getComputedStyle(root).getPropertyValue(name).trim() || fallback
  }

  const isDark = theme === "dark"

  return {
    grid: {
      stroke: cssVar("--border", isDark ? "#27272A" : "#e4e4e7"),
    },
    axis: {
      tick: {
        fill: cssVar("--muted-foreground", isDark ? "#A1A1AA" : "#71717a"),
        fontSize: 11,
      },
    },
    tooltip: {
      contentStyle: {
        background: cssVar("--card", isDark ? "#18181B" : "#f4f4f5"),
        border: `1px solid ${cssVar("--border", isDark ? "#27272A" : "#e4e4e7")}`,
        borderRadius: 8,
        fontSize: 12,
        color: cssVar("--card-foreground", isDark ? "#fafafa" : "#09090b"),
      },
      labelStyle: {
        color: cssVar("--muted-foreground", isDark ? "#A1A1AA" : "#71717a"),
      },
    },
    legend: {
      wrapperStyle: {
        fontSize: 11,
        color: cssVar("--muted-foreground", isDark ? "#A1A1AA" : "#71717a"),
        paddingTop: 8,
      },
    },
    colors: {
      chart1: cssVar("--chart-1", isDark ? "#F97316" : "#EA6F0A"),
      chart2: cssVar("--chart-2", isDark ? "#3B82F6" : "#2563EB"),
      chart3: cssVar("--chart-3", isDark ? "#A855F7" : "#7C3AED"),
      chart4: cssVar("--chart-4", isDark ? "#06B6D4" : "#0891B2"),
      chart5: cssVar("--chart-5", isDark ? "#22C55E" : "#16A34A"),
    },
  }
}
