"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
  className?: string
}

export default function TagInput({ value, onChange, placeholder = "Add tag…", suggestions = [], className }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue("")
  }

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag))

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s.toLowerCase())
  ).slice(0, 6)

  return (
    <div className={cn("relative", className)}>
      <div
        className="flex flex-wrap gap-1.5 min-h-9 rounded-md border border-input bg-card px-3 py-1.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary/70">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 border-0 bg-transparent p-0 h-auto text-sm shadow-none focus-visible:ring-0"
        />
      </div>
      {/* Suggestions dropdown */}
      {inputValue && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md border border-border bg-card shadow-lg overflow-hidden">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); addTag(s) }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-accent text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
