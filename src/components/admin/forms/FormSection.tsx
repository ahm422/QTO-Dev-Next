import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FormSectionProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export default function FormSection({ title, subtitle, icon: Icon, children, className }: FormSectionProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        {Icon && (
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}
