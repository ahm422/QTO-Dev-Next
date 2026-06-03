"use client"

import { useState } from "react"
import * as Icons from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Curated set of business-relevant icons
const ICON_NAMES = [
  "Briefcase", "Code", "Globe", "Layers", "Cpu", "Database",
  "Shield", "Zap", "Star", "Heart", "Target", "Rocket",
  "Users", "Building2", "Award", "CheckCircle", "TrendingUp",
  "BarChart2", "PieChart", "LineChart", "Settings", "Wrench",
  "Cloud", "Lock", "Key", "Mail", "Phone", "MessageSquare",
  "FileText", "Folder", "Image", "Video", "Music", "Camera",
  "Map", "Navigation", "Compass", "Search", "Eye", "ThumbsUp",
  "Package", "Truck", "ShoppingCart", "CreditCard", "DollarSign",
  "Headphones", "Mic", "Monitor", "Smartphone", "Tablet", "Watch",
  "Pen", "Edit", "Scissors", "Palette", "Brush", "Sparkles",
  "Sun", "Moon", "Leaf", "Flower", "Mountain", "Waves",
] as const

type IconName = (typeof ICON_NAMES)[number]

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
  className?: string
}

export default function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = useState("")

  const filtered = ICON_NAMES.filter((name) =>
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
          const isSelected = value === name
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(name)}
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
        <p className="text-xs text-muted-foreground">Selected: <span className="text-foreground font-medium">{value}</span></p>
      )}
    </div>
  )
}
