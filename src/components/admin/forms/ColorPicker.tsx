"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const PRESET_COLORS = [
  "#F97316", "#3B82F6", "#A855F7", "#06B6D4", "#22C55E",
  "#EAB308", "#EF4444", "#EC4899", "#14B8A6", "#8B5CF6",
  "#F59E0B", "#6366F1", "#84CC16", "#F43F5E", "#0EA5E9",
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

export default function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [custom, setCustom] = useState(value || "#F97316")

  const handleCustom = (v: string) => {
    setCustom(v)
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => { onChange(color); setCustom(color) }}
            className={cn(
              "h-7 w-7 rounded-lg border-2 transition-transform hover:scale-110",
              value === color ? "border-foreground scale-110 shadow-md" : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg border border-border shrink-0" style={{ backgroundColor: custom }} />
        <Input
          value={custom}
          onChange={(e) => handleCustom(e.target.value)}
          placeholder="#F97316"
          className="h-8 font-mono text-sm bg-card border-border"
          maxLength={7}
        />
      </div>
    </div>
  )
}
