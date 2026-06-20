import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Textarea({ className, value, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
      value={value ?? ""}
    />
  )
}

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
}

function FormTextarea({ label, error, className, id, ...props }: FormTextareaProps) {
  const textareaId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={textareaId} className="block text-foreground mb-1">
          {label}
        </Label>
      )}
      <Textarea
        id={textareaId}
        className={cn(error && "border-destructive focus-visible:ring-destructive/20", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { Textarea, FormTextarea }
