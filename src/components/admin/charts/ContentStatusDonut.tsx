"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { getAdminChartTheme } from "@/lib/admin/chartTheme"

export interface DonutDataPoint {
  label: string
  value: number
  color: string
}

interface ContentStatusDonutProps {
  data: DonutDataPoint[]
  total?: number
  centerLabel?: string
}

export default function ContentStatusDonut({ data, total, centerLabel = "Total" }: ContentStatusDonutProps) {
  const { theme } = useAdminTheme()
  const ct = getAdminChartTheme(theme)
  const sum = total ?? data.reduce((acc, d) => acc + d.value, 0)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={ct.tooltip.contentStyle}
              labelStyle={ct.tooltip.labelStyle}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-foreground tabular-nums">{sum}</span>
          <span className="text-[10px] text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-1.5 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <span className="text-xs font-semibold text-foreground tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
