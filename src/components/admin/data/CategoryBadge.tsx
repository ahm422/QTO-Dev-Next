import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string
  className?: string
}

// Deterministic color from category string
function categoryColor(cat: string): string {
  const colors = [
    "bg-[var(--admin-accent-blue)]/10 text-[var(--admin-accent-blue)] border-[var(--admin-accent-blue)]/20",
    "bg-[var(--admin-accent-purple)]/10 text-[var(--admin-accent-purple)] border-[var(--admin-accent-purple)]/20",
    "bg-[var(--admin-accent-teal)]/10 text-[var(--admin-accent-teal)] border-[var(--admin-accent-teal)]/20",
    "bg-primary/10 text-primary border-primary/20",
    "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20",
    "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20",
  ]
  let hash = 0
  for (let i = 0; i < cat.length; i++) hash = (hash * 31 + cat.charCodeAt(i)) % colors.length
  return colors[Math.abs(hash)]
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium", categoryColor(category), className)}>
      {category}
    </span>
  )
}
