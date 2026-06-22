import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Input({ className, type, value, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-lg border bg-background/50 px-3 py-2 text-sm outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
      value={value ?? ""}
    />
  )
}

interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  description?: string
  required?: boolean
}

function FormInput({ label, error, description, required, className, id, ...props }: FormInputProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} className="block text-sm font-medium text-foreground/90 mb-1">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      {description && <p className="text-xs text-muted-foreground mb-1.5">{description}</p>}
      <Input
        id={inputId}
        className={cn(error && "border-destructive focus-visible:ring-destructive/20", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export { Input, FormInput }
