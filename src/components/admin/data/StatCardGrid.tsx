import { cn } from "@/lib/utils"

interface StatCardGridProps {
  children: React.ReactNode
  cols?: 2 | 3 | 4 | 5
  className?: string
}

const colsStyles: Record<NonNullable<StatCardGridProps["cols"]>, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
}

export default function StatCardGrid({ children, cols = 5, className }: StatCardGridProps) {
  return (
    <div className={cn("grid gap-4 mb-6", colsStyles[cols], className)}>
      {children}
    </div>
  )
}
