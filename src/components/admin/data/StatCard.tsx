import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  badge?: string
  badgeVariant?: "success" | "warning" | "info" | "primary"
  progress?: number
  iconColor?: "primary" | "blue" | "purple" | "teal" | "success" | "warning"
  className?: string
}

const iconColorStyles: Record<NonNullable<StatCardProps["iconColor"]>, string> = {
  primary: "bg-primary/10 text-primary",
  blue:    "bg-[var(--admin-accent-blue)]/10 text-[var(--admin-accent-blue)]",
  purple:  "bg-[var(--admin-accent-purple)]/10 text-[var(--admin-accent-purple)]",
  teal:    "bg-[var(--admin-accent-teal)]/10 text-[var(--admin-accent-teal)]",
  success: "bg-[var(--admin-success)]/10 text-[var(--admin-success)]",
  warning: "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)]",
}

const badgeStyles: Record<NonNullable<StatCardProps["badgeVariant"]>, string> = {
  success: "bg-[var(--admin-success)]/15 text-[var(--admin-success)]",
  warning: "bg-[var(--admin-warning)]/15 text-[var(--admin-warning)]",
  info:    "bg-[var(--admin-accent-blue)]/15 text-[var(--admin-accent-blue)]",
  primary: "bg-primary/15 text-primary",
}

const progressColorStyles: Record<NonNullable<StatCardProps["iconColor"]>, string> = {
  primary: "bg-primary",
  blue:    "bg-[var(--admin-accent-blue)]",
  purple:  "bg-[var(--admin-accent-purple)]",
  teal:    "bg-[var(--admin-accent-teal)]",
  success: "bg-[var(--admin-success)]",
  warning: "bg-[var(--admin-warning)]",
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  badge,
  badgeVariant = "primary",
  progress,
  iconColor = "primary",
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-2">
        {Icon && (
          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", iconColorStyles[iconColor])}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        {badge && (
          <span className={cn("ml-auto text-[11px] font-medium rounded-full px-2 py-0.5", badgeStyles[badgeVariant])}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
      {typeof progress === "number" && (
        <div className="h-1 w-full rounded-full bg-border overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", progressColorStyles[iconColor])}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}
