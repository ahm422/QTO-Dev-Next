"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterBarFilter {
  key: string
  placeholder: string
  options: FilterOption[]
}

interface FilterBarProps {
  searchPlaceholder?: string
  filters?: FilterBarFilter[]
  className?: string
}

export default function FilterBar({ searchPlaceholder = "Search…", filters = [], className }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme } = useAdminTheme()
  const themeClass = theme === "dark" ? "admin-dark" : "admin-light"

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => {
    router.push(pathname)
  }

  const hasFilters = Array.from(searchParams.entries()).some(([k]) => k !== "page")
  const searchValue = searchParams.get("q") ?? ""

  return (
    <div className={cn("flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 mb-4", className)}>
      {/* Search */}
      <div className="relative w-full sm:flex-1 sm:min-w-48 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={searchValue}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8 h-8 text-sm bg-card border-border"
        />
        {searchValue && (
          <button
            onClick={() => setParam("q", "")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dynamic filters */}
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={searchParams.get(filter.key) ?? "all"}
          onValueChange={(v) => setParam(filter.key, v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-32 text-sm bg-card border-border">
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent className={themeClass}>
            <SelectItem value="all">{filter.placeholder}</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-muted-foreground hover:text-foreground gap-1.5 px-2.5">
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
