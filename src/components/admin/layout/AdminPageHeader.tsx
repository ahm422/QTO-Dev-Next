import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AdminBreadcrumb {
  label: string
  href?: string
}

export interface AdminHeaderBadge {
  label: string
  variant: "success" | "warning" | "info" | "primary" | "destructive"
}

export interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: AdminBreadcrumb[]
  badges?: AdminHeaderBadge[]
  actions?: React.ReactNode
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

const badgeStyles: Record<AdminHeaderBadge["variant"], string> = {
  success: "bg-[var(--admin-success)]/15 text-[var(--admin-success)] border-[var(--admin-success)]/30",
  warning: "bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] border-[var(--admin-warning)]/30",
  info:    "bg-[var(--admin-accent-blue)]/15 text-[var(--admin-accent-blue)] border-[var(--admin-accent-blue)]/30",
  primary: "bg-primary/15 text-primary border-primary/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
}

export default function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs,
  badges,
  actions,
  primaryAction,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-2" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`text-xs ${isLast ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                    {crumb.label}
                  </span>
                )}
              </span>
            )
          })}
        </nav>
      )}

      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {badges?.map((badge, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  badgeStyles[badge.variant]
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
          {actions}
          {primaryAction && (
            primaryAction.href ? (
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : (
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
