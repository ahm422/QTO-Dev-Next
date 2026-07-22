import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Plus, Pencil, Globe, Trash2, type LucideIcon } from "lucide-react"
import type { RecentActivityAction, RecentActivityItem } from "@/lib/admin/recentActivity"

export type { RecentActivityItem } from "@/lib/admin/recentActivity"

const actionStyles: Record<RecentActivityAction, string> = {
  created:   "bg-[var(--admin-success)]/15 text-[var(--admin-success)]",
  updated:   "bg-[var(--admin-accent-blue)]/15 text-[var(--admin-accent-blue)]",
  published: "bg-primary/15 text-primary",
  deleted:   "bg-destructive/15 text-destructive",
}

const actionIcons: Record<RecentActivityAction, LucideIcon> = {
  created:   Plus,
  updated:   Pencil,
  published: Globe,
  deleted:   Trash2,
}

function initialsOf(value: string): string {
  return value
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function ItemAvatar({ item }: Readonly<{ item: RecentActivityItem }>) {
  const source = item.actor?.name?.trim() || item.label
  return (
    <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-[10px] font-semibold text-muted-foreground">
      {initialsOf(source) || "?"}
    </div>
  )
}

function ActivityFeedItemBody({ item }: Readonly<{ item: RecentActivityItem }>) {
  const at = new Date(item.at)
  const relTime = formatDistanceToNow(at, { addSuffix: true })
  const Icon = actionIcons[item.action]
  return (
    <>
      <ItemAvatar item={item} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-foreground truncate">
          <span className="font-medium">{item.label}</span>
          <span className="text-muted-foreground"> in {item.section}</span>
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-medium rounded px-1.5 py-0.5",
              actionStyles[item.action]
            )}
          >
            <Icon className="h-3 w-3" />
            {item.action}
          </span>
          {item.actor?.name ? (
            <span className="text-[10px] text-muted-foreground truncate">by {item.actor.name}</span>
          ) : null}
          <span className="text-[10px] text-muted-foreground shrink-0" title={at.toLocaleString()}>
            {relTime}
          </span>
        </div>
      </div>
    </>
  )
}

function ActivityFeedItem({ item }: Readonly<{ item: RecentActivityItem }>) {
  const rowClass = "flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0"
  if (item.href) {
    return (
      <Link href={item.href} className={cn(rowClass, "-mx-3 px-3 rounded-lg hover:bg-accent transition-colors")}>
        <ActivityFeedItemBody item={item} />
      </Link>
    )
  }
  return (
    <div className={rowClass}>
      <ActivityFeedItemBody item={item} />
    </div>
  )
}

interface ActivityFeedProps {
  items: RecentActivityItem[]
  className?: string
}

export default function ActivityFeed({ items, className }: Readonly<ActivityFeedProps>) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground py-6 text-center">No recent activity</p>
  }
  return (
    <div className={cn("divide-y divide-border/0", className)}>
      {items.map((item) => (
        <ActivityFeedItem key={item.id} item={item} />
      ))}
    </div>
  )
}
