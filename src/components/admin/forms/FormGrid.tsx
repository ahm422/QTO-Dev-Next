import { cn } from "@/lib/utils"

interface FormGridProps {
  cols?: 2 | 3
  children: React.ReactNode
  className?: string
}

const colStyles = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}

export default function FormGrid({ cols = 2, children, className }: FormGridProps) {
  return (
    <div className={cn("grid gap-4", colStyles[cols], className)}>
      {children}
    </div>
  )
}
