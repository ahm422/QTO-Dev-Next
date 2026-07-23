"use client"

import { Textarea } from "@/components/ui/textarea"
import { arrayToLines, linesToArray, linesToDraftArray } from "@/lib/admin/lineListField"
import { cn } from "@/lib/utils"

interface LineListTextareaProps {
  value: string[]
  onChange: (value: string[]) => void
  rows?: number
  placeholder?: string
  className?: string
}

export default function LineListTextarea({
  value,
  onChange,
  rows = 3,
  placeholder,
  className,
}: LineListTextareaProps) {
  return (
    <Textarea
      value={arrayToLines(value)}
      onChange={(e) => onChange(linesToDraftArray(e.target.value))}
      onBlur={(e) => onChange(linesToArray(e.target.value))}
      rows={rows}
      placeholder={placeholder}
      className={cn(className)}
    />
  )
}
