import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FormSectionProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  /** Wrap the section in a subtle card surface (opt-in — most admin forms
   * render sections flush). */
  card?: boolean
}

export default function FormSection({ title, subtitle, icon: Icon, children, className, card }: FormSectionProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        card && "rounded-xl border border-border bg-card/50 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </div>
        )}
        <h3 className="text-sm font-semibold text-foreground whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
      {subtitle && <p className="text-xs text-muted-foreground -mt-2">{subtitle}</p>}
      {children}
    </div>
  )
}
