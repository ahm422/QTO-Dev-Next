"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RULES = [
  { label: "12+ characters", test: (p: string) => p.length >= 12 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Digit (0–9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export function PasswordRequirementsChecklist({ password }: { password: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-4 py-3">
      <p className="text-xs font-medium text-foreground mb-2">Password requirements</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
        {RULES.map(({ label, test }) => {
          const passes = password.length > 0 && test(password)
          return (
            <span
              key={label}
              className={cn(
                "flex items-center gap-1.5 text-xs",
                passes ? "text-emerald-500" : "text-muted-foreground",
              )}
            >
              {passes
                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                : <Circle className="h-3.5 w-3.5 shrink-0" />}
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
