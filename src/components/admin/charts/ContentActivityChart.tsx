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

export interface ActivityDataPoint {
  month: string
  services?: number
  blog?: number
  projects?: number
}

interface ContentActivityChartProps {
  data: ActivityDataPoint[]
}

const LINES = [
  { key: "services", color: "#F97316", label: "Services" },
  { key: "blog",     color: "#3B82F6", label: "Blog" },
  { key: "projects", color: "#A855F7", label: "Projects" },
] as const

export default function ContentActivityChart({ data }: ContentActivityChartProps) {
  const [range, setRange] = useState<"6m" | "1y">("6m")
  const displayed = range === "6m" ? data.slice(-6) : data

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
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#71717A", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717A", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ background: "#18181B", border: "1px solid #27272A", borderRadius: 8, fontSize: 12, color: "#fafafa" }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#71717A", paddingTop: 8 }}
          />
          {LINES.map(({ key, color, label }) => (
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
