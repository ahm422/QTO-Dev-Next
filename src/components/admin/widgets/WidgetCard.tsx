import { cn } from "@/lib/utils"

interface WidgetCardProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function WidgetCard({ title, children, actions, className }: WidgetCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
