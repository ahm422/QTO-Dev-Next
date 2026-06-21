import { cn } from "@/lib/utils"

interface SidebarNavGroupProps {
  label: string
  children: React.ReactNode
  isFirst?: boolean
  className?: string
}

export default function SidebarNavGroup({ label, children, isFirst, className }: SidebarNavGroupProps) {
  return (
    <div className={cn("mb-4", className)}>
      {!isFirst && <hr className="border-border mb-3 mx-2" />}
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
        {label}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  )
}
