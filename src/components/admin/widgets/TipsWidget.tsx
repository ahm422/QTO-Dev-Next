import WidgetCard from "@/components/admin/widgets/WidgetCard"
import { Info } from "lucide-react"

interface TipsWidgetProps {
  title?: string
  tips: string[]
  className?: string
}

export default function TipsWidget({ title = "Tips", tips, className }: TipsWidgetProps) {
  return (
    <WidgetCard title={title} className={className}>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-[var(--admin-accent-blue)] shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
