import { cn } from "@/lib/utils"

type StatusVariant = "published" | "draft" | "active" | "pending" | "archived"

interface StatusBadgeProps {
  status: StatusVariant | boolean
  publishedLabel?: string
  draftLabel?: string
  className?: string
}

export default function StatusBadge({
  status,
  publishedLabel = "Published",
  draftLabel = "Draft",
  className,
}: StatusBadgeProps) {
  let label: string
  let dotColor: string
  let bgColor: string

  if (typeof status === "boolean") {
    label = status ? publishedLabel : draftLabel
    dotColor = status ? "bg-[var(--admin-success)]" : "bg-[var(--admin-warning)]"
    bgColor = status
      ? "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20"
      : "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20"
  } else {
    const map: Record<StatusVariant, { label: string; dot: string; bg: string }> = {
      published: { label: "Published", dot: "bg-[var(--admin-success)]", bg: "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20" },
      draft:     { label: "Draft",     dot: "bg-[var(--admin-warning)]", bg: "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20" },
      active:    { label: "Active",    dot: "bg-[var(--admin-accent-blue)]", bg: "bg-[var(--admin-accent-blue)]/10 text-[var(--admin-accent-blue)] border-[var(--admin-accent-blue)]/20" },
      pending:   { label: "Pending",   dot: "bg-muted-foreground", bg: "bg-muted text-muted-foreground border-border" },
      archived:  { label: "Archived",  dot: "bg-muted-foreground", bg: "bg-muted text-muted-foreground border-border" },
    }
    const s = map[status]
    label = s.label; dotColor = s.dot; bgColor = s.bg
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", bgColor, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
      {label}
    </span>
  )
}
