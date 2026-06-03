import { cn } from "@/lib/utils"

interface AdminWidgetPanelProps {
  children: React.ReactNode
  className?: string
}

export default function AdminWidgetPanel({ children, className }: AdminWidgetPanelProps) {
  return (
    <aside className={cn("space-y-4", className)}>
      {children}
    </aside>
  )
}
