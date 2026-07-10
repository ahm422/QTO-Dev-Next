"use client"

import { useState } from "react"
import * as Icons from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  isLucideIconSelected,
  lucideToAppIcon,
  MAPPED_LUCIDE_ICON_NAMES,
} from "@/lib/icons/iconMap"

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
  className?: string
}

export default function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = useState("")

  const filtered = MAPPED_LUCIDE_ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search icons…"
          className="pl-8 h-8 text-sm bg-card border-border"
        />
      </div>
      <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto scrollbar-none rounded-lg border border-border bg-muted/30 p-2">
        {filtered.map((name) => {
          const LucideIcon = (Icons as Record<string, Icons.LucideIcon>)[name]
          if (!LucideIcon) return null
          const isSelected = isLucideIconSelected(name, value)
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => {
                const appIcon = lucideToAppIcon(name)
                if (appIcon) onChange(appIcon)
              }}
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-lg transition-colors",
                isSelected
                  ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <LucideIcon className="h-4 w-4" />
            </button>
          )
        })}
      </div>
      {value && (
        <p className="text-xs text-muted-foreground">
          Selected: <span className="text-foreground font-medium">{value}</span>
        </p>
      )}
    </div>
  )
}
