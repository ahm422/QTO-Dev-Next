"use client"

import { useMemo, useState } from "react"
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { cn } from "@/lib/utils"

type SliceShapeProps = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill?: string
}

export interface DonutDataPoint {
  label: string
  value: number
  color: string
}

interface ContentStatusDonutProps {
  readonly data: readonly DonutDataPoint[]
  readonly total?: number
  readonly centerLabel?: string
}

export default function ContentStatusDonut({
  data,
  total,
  centerLabel = "Total",
}: ContentStatusDonutProps) {
  // Re-render when admin theme toggles so CSS token-driven styles refresh.
  useAdminTheme()

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const sum = total ?? data.reduce((acc, d) => acc + d.value, 0)
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.label,
        value: d.value,
        fill: d.color,
      })),
    [data]
  )

  const activeItem = activeIndex != null ? data[activeIndex] : null
  const centerValue = activeItem?.value ?? sum
  const centerText = activeItem?.label ?? centerLabel
  const glowColor = activeItem?.color ?? data[0]?.color ?? "var(--primary)"

  const renderSlice = (props: SliceShapeProps, index: number) => {
    const highlighted = activeIndex === index
    const dimmed = activeIndex != null && !highlighted
    // Keep expansion inside the chart box so the ring stays a full circle.
    const boost = Math.max(3, props.outerRadius * 0.04)
    const halo = Math.max(5, props.outerRadius * 0.08)

    return (
      <g>
        {highlighted && (
          <Sector
            cx={props.cx}
            cy={props.cy}
            innerRadius={Math.max(0, props.innerRadius - 2)}
            outerRadius={props.outerRadius + halo}
            startAngle={props.startAngle}
            endAngle={props.endAngle}
            fill={props.fill}
            opacity={0.16}
            stroke="none"
          />
        )}
        <Sector
          cx={props.cx}
          cy={props.cy}
          innerRadius={props.innerRadius}
          outerRadius={highlighted ? props.outerRadius + boost : props.outerRadius}
          startAngle={props.startAngle}
          endAngle={props.endAngle}
          cornerRadius={4}
          fill={props.fill}
          opacity={dimmed ? 0.35 : 1}
          stroke="none"
        />
      </g>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Fixed square so ResponsiveContainer gets equal width/height (no top/bottom clip) */}
      <div className="relative mx-auto size-[200px] overflow-visible">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[20%] rounded-full blur-2xl transition-[background] duration-300"
          style={{
            background: `radial-gradient(circle, ${glowColor}33 0%, transparent 70%)`,
          }}
        />

        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="78%"
              paddingAngle={3}
              cornerRadius={4}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
              isAnimationActive
              shape={renderSlice}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-[1.75rem] font-semibold leading-none tracking-tight text-foreground tabular-nums">
            {centerValue}
          </span>
          <span
            className={cn(
              "mt-1.5 max-w-[7.5rem] truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-200"
            )}
            style={activeItem ? { color: activeItem.color } : undefined}
          >
            {centerText}
          </span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {data.map((item, i) => {
          const pct = sum > 0 ? Math.round((item.value / sum) * 100) : 0
          const isActive = activeIndex === i

          return (
            <li key={item.label}>
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className={cn(
                  "group w-full rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                  "border-transparent bg-muted/30 hover:border-border hover:bg-muted/55",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isActive && "border-border bg-muted/60 shadow-[var(--admin-shadow-sm)]"
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-background shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-xs font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-1.5">
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {item.value}
                    </span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: item.color,
                      opacity: isActive ? 1 : 0.75,
                    }}
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
