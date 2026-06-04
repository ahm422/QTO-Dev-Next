"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TECH_CATALOG, catalogByKey } from "@/lib/technologies/techCatalog"
import { SI_ICON_MAP } from "@/components/technologies/TechIcon"

interface TechnologyIconPickerProps {
  value: string
  onChange: (key: string) => void
}

export default function TechnologyIconPicker({ value, onChange }: TechnologyIconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selected = value ? catalogByKey[value] : undefined
  const SelectedIcon = selected ? SI_ICON_MAP[selected.iconKey] : undefined

  const filtered = TECH_CATALOG.filter(
    (e) =>
      e.iconKey !== "amazonaws" &&
      (search === "" ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.iconKey.toLowerCase().includes(search.toLowerCase()))
  )

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
              <SelectedIcon size={16} color="currentColor" title={selected?.name} />
            ) : (
              <span className="h-4 w-4 rounded bg-muted" />
            )}
            <span className="truncate text-muted-foreground">
              {selected ? selected.iconKey : "Select icon…"}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search icons…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-64">
            {filtered.length === 0 && (
              <CommandEmpty>No icons found.</CommandEmpty>
            )}
            <div className="grid grid-cols-6 gap-1 p-2">
              {filtered.map((entry) => {
                const Icon = SI_ICON_MAP[entry.iconKey]
                if (!Icon) return null
                const isSelected = value === entry.iconKey
                return (
                  <button
                    key={entry.iconKey}
                    type="button"
                    title={`${entry.name} (${entry.iconKey})`}
                    onClick={() => {
                      onChange(entry.iconKey)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-md p-2 text-center transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-primary/15 ring-1 ring-primary/50 text-primary"
                    )}
                  >
                    <Icon size={20} color="currentColor" title={entry.name} />
                    <span className="text-[9px] leading-tight text-muted-foreground truncate w-full">
                      {entry.iconKey}
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
