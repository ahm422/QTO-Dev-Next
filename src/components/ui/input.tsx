import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
}

function FormInput({ label, error, className, id, ...props }: FormInputProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} className="block text-foreground mb-1">
          {label}
        </Label>
      )}
      <Input
        id={inputId}
        className={cn(error && "border-destructive focus-visible:ring-destructive/20", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { Input, FormInput }
