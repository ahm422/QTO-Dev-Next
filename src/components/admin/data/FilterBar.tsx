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
    <div className={cn("flex flex-col sm:flex-row gap-2 mb-4", className)}>
      {/* Search — full width on mobile, flex-1 on sm+ */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchValue}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 h-9 text-sm bg-card border-border"
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

      {/* Filters + clear grouped so they wrap together on narrow screens */}
      {(filters.length > 0 || hasFilters) && (
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={searchParams.get(filter.key) ?? "all"}
              onValueChange={(v) => setParam(filter.key, v)}
            >
              <SelectTrigger className="h-9 w-auto min-w-32 text-sm bg-card border-border">
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
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-muted-foreground hover:text-foreground gap-1.5 px-2.5">
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
