"use client"

import { useMemo, useState } from "react"
import { ChevronDown, X } from "lucide-react"
import * as SimpleIcons from "@icons-pack/react-simple-icons"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { resolveSimpleIcon } from "@/components/technologies/TechIcon"

// All available icon keys derived from the package exports at build time
const ALL_ICON_KEYS: string[] = Object.keys(SimpleIcons)
  .filter((k) => k.startsWith("Si") && !k.endsWith("Hex"))
  .map((k) => k.slice(2).toLowerCase()) // "SiCplusplus" → "cplusplus"

interface TechnologyIconPickerProps {
  value: string
  onChange: (key: string) => void
}

export default function TechnologyIconPicker({ value, onChange }: TechnologyIconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const SelectedIcon = value ? resolveSimpleIcon(value) : undefined

  const filtered = useMemo(() => {
    if (!search) return ALL_ICON_KEYS.slice(0, 120)
    const q = search.toLowerCase().replace(/[^a-z0-9]/g, "")
    return ALL_ICON_KEYS.filter((key) => key.includes(q)).slice(0, 120)
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
            "focus:outline-none focus:ring-1 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          aria-label="Pick technology icon"
        >
          <span className="flex items-center gap-2 min-w-0">
            {SelectedIcon ? (
              <SelectedIcon size={16} color="currentColor" title={value} />
            ) : (
              <span className="h-4 w-4 rounded bg-muted" />
            )}
            <span className="truncate text-muted-foreground">
              {value || "Select icon…"}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search 3000+ icons…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-64">
            {filtered.length === 0 && (
              <CommandEmpty>No icons found.</CommandEmpty>
            )}
            <div className="grid grid-cols-6 gap-1 p-2">
              {filtered.map((iconKey) => {
                const Icon = resolveSimpleIcon(iconKey)
                if (!Icon) return null
                const isSelected = value === iconKey
                return (
                  <button
                    key={iconKey}
                    type="button"
                    title={iconKey}
                    onClick={() => {
                      onChange(iconKey)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-md p-2 text-center transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-primary/15 ring-1 ring-primary/50 text-primary"
                    )}
                  >
                    <Icon size={20} color="currentColor" title={iconKey} />
                    <span className="text-[9px] leading-tight text-muted-foreground truncate w-full">
                      {iconKey}
                    </span>
                  </button>
                )
              })}
            </div>
          </CommandList>

          {value && (
            <div className="border-t px-2 py-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-full gap-1.5 text-xs text-muted-foreground"
                onClick={() => {
                  onChange("")
                  setOpen(false)
                  setSearch("")
                }}
              >
                <X className="h-3 w-3" />
                Clear selection
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
