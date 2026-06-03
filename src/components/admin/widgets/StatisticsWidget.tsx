import WidgetCard from "@/components/admin/widgets/WidgetCard"
import { cn } from "@/lib/utils"

export interface StatisticItem {
  label: string
  value: string | number
  progress?: number
  color?: "primary" | "blue" | "purple" | "teal" | "success" | "warning"
}

const progressColors: Record<NonNullable<StatisticItem["color"]>, string> = {
  primary: "bg-primary",
  blue:    "bg-[var(--admin-accent-blue)]",
  purple:  "bg-[var(--admin-accent-purple)]",
  teal:    "bg-[var(--admin-accent-teal)]",
  success: "bg-[var(--admin-success)]",
  warning: "bg-[var(--admin-warning)]",
}

interface StatisticsWidgetProps {
  title?: string
  items: StatisticItem[]
  className?: string
}

export default function StatisticsWidget({ title = "Statistics", items, className }: StatisticsWidgetProps) {
  return (
    <WidgetCard title={title} className={className}>
      <div className="space-y-3">
        {items.map((item, i) => {
          const color = item.color ?? "primary"
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground tabular-nums">{item.value}</span>
              </div>
              {typeof item.progress === "number" && (
                <div className="h-1 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", progressColors[color])}
                    style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </WidgetCard>
  )
}
