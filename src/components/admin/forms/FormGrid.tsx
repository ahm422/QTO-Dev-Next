import { cn } from "@/lib/utils"

interface FormGridProps {
  cols?: 1 | 2 | 3
  children: React.ReactNode
  className?: string
}

const colStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}

export default function FormGrid({ cols = 2, children, className }: FormGridProps) {
  return (
    <div className={cn("grid gap-4", colStyles[cols], className)}>
      {children}
    </div>
  )
}

export function FormGridSpan({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={cols === 3 ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2"}>
      {children}
    </div>
  )
}
