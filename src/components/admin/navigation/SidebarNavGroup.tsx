import { cn } from "@/lib/utils"

interface SidebarNavGroupProps {
  label: string
  children: React.ReactNode
  isFirst?: boolean
  className?: string
}

export default function SidebarNavGroup({ label, children, isFirst, className }: SidebarNavGroupProps) {
  return (
    <div className={cn("mb-1", !isFirst && "pt-3 mt-2 border-t border-border/50", className)}>
      <div className="flex items-center gap-2 px-3 mb-1.5">
        <span className="h-1 w-1 shrink-0 rounded-full bg-primary/50" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
          {label}
        </p>
      </div>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  )
}
