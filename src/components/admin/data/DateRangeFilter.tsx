"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface DateRangeFilterProps {
  className?: string
}

export default function DateRangeFilter({ className }: DateRangeFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setDateParam = useCallback(
    (key: "from" | "to", value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground whitespace-nowrap">Date range</span>
      <input
        type="date"
        value={searchParams.get("from") ?? ""}
        onChange={(e) => setDateParam("from", e.target.value)}
        className="h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <span className="text-xs text-muted-foreground">–</span>
      <input
        type="date"
        value={searchParams.get("to") ?? ""}
        onChange={(e) => setDateParam("to", e.target.value)}
        className="h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
