"use client";

import * as React from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  error?: string;
  required?: boolean;
}

/**
 * Local password field for the admin login screen.
 *
 * Composes the shared base `Input` with an absolutely-positioned show/hide
 * toggle instead of editing the shared `FormInput` primitive. The toggle is a
 * `type="button"` so it never submits the form, is keyboard-accessible, and
 * carries an aria-label reflecting its current state.
 */
export function PasswordField({
  label = "Password",
  error,
  required,
  id,
  className,
  disabled,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);
  const inputId =
    id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : "password");

  return (
    <div className="w-full">
      {label && (
        <Label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-foreground/90"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={inputId}
          type={visible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            "pr-10",
            error && "border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          tabIndex={0}
          className={cn(
            "absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors",
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
