import * as React from "react"
import { AlertCircle } from "lucide-react"

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
  required?: boolean
  floatingLabel?: boolean
}

function FormTextarea({
  label,
  error,
  required,
  floatingLabel = false,
  className,
  id,
  value,
  placeholder,
  ...props
}: FormTextareaProps) {
  const textareaId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined)
  const hasValue = value !== undefined && value !== null && String(value).length > 0

  if (floatingLabel && label) {
    return (
      <div className="w-full">
        <div className="relative">
          <Textarea
            id={textareaId}
            value={value}
            placeholder=" "
            className={cn(
              "peer min-h-[140px] resize-y pt-7 pb-3 px-3",
              "focus-visible:ring-primary/30 focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]",
              error && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            aria-invalid={!!error}
            aria-label={label}
            {...props}
          />
          <Label
            htmlFor={textareaId}
            className={cn(
              "pointer-events-none absolute left-3 top-4 text-sm text-muted-foreground transition-all duration-200",
              "peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary",
              (hasValue || props.defaultValue) && "top-2 text-[11px] font-medium"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={textareaId} className="block text-foreground mb-1">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <Textarea
        id={textareaId}
        value={value}
        placeholder={placeholder}
        className={cn(error && "border-destructive focus-visible:ring-destructive/20", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export { Textarea, FormTextarea }
