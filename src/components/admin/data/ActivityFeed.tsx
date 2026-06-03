import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export interface ActivityItem {
  id: string
  label: string
  section: string
  action: "created" | "updated" | "published" | "deleted"
  updatedAt: Date
}

const actionStyles: Record<ActivityItem["action"], string> = {
  created:   "bg-[var(--admin-success)]/15 text-[var(--admin-success)]",
  updated:   "bg-[var(--admin-accent-blue)]/15 text-[var(--admin-accent-blue)]",
  published: "bg-primary/15 text-primary",
  deleted:   "bg-destructive/15 text-destructive",
}

function ItemInitials({ label }: { label: string }) {
  const initials = label.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
  return (
    <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-[10px] font-semibold text-muted-foreground">
      {initials}
    </div>
  )
}

function ActivityFeedItem({ item }: { item: ActivityItem }) {
  const relTime = formatDistanceToNow(item.updatedAt, { addSuffix: true })
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
      <ItemInitials label={item.label} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-foreground truncate">
          <span className="font-medium">{item.label}</span>
          <span className="text-muted-foreground"> in {item.section}</span>
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn("text-[10px] font-medium rounded px-1.5 py-0.5", actionStyles[item.action])}>
            {item.action}
          </span>
          <span className="text-[10px] text-muted-foreground">{relTime}</span>
        </div>
      </div>
    </div>
  )
}

interface ActivityFeedProps {
  items: ActivityItem[]
  className?: string
}

export default function ActivityFeed({ items, className }: ActivityFeedProps) {
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
