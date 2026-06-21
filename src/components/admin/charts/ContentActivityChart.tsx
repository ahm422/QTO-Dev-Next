"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { getAdminChartTheme } from "@/lib/admin/chartTheme"

export interface ActivityDataPoint {
  month: string
  services?: number
  blog?: number
  projects?: number
}

interface ContentActivityChartProps {
  data: ActivityDataPoint[]
}

export default function ContentActivityChart({ data }: ContentActivityChartProps) {
  const [range, setRange] = useState<"6m" | "1y">("6m")
  const { theme } = useAdminTheme()
  const ct = getAdminChartTheme(theme)
  const displayed = range === "6m" ? data.slice(-6) : data

  const lines = [
    { key: "services", color: ct.colors.chart1, label: "Services" },
    { key: "blog",     color: ct.colors.chart2, label: "Blog" },
    { key: "projects", color: ct.colors.chart3, label: "Projects" },
  ] as const

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-1">
        {(["6m", "1y"] as const).map((r) => (
          <Button
            key={r}
            size="sm"
            variant={range === r ? "default" : "ghost"}
            onClick={() => setRange(r)}
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
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={displayed} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={ct.grid.stroke} vertical={false} />
          <XAxis
            dataKey="month"
            tick={ct.axis.tick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={ct.axis.tick}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={ct.tooltip.contentStyle}
            labelStyle={ct.tooltip.labelStyle}
          />
          <Legend wrapperStyle={ct.legend.wrapperStyle} />
          {lines.map(({ key, color, label }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              name={label}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
