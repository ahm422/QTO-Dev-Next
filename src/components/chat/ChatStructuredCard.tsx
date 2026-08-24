"use client";

import { cn } from "@/components/theme/cn";
import type { StructuredDataBlock, StructuredDataField } from "@/types/chat";

const STATUS_CLASSES: Record<NonNullable<StructuredDataField["status"]>, string> = {
  neutral: "bg-surface-muted text-foreground",
  success: "bg-green-500/15 text-green-600 dark:text-green-400",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  error: "bg-red-500/15 text-red-600 dark:text-red-400",
};

interface ChatStructuredCardProps {
  data: StructuredDataBlock;
  className?: string;
}

/**
 * Generic key/value data card — renders any `StructuredDataBlock` (deploy summary,
 * ticket snapshot, etc). Never model a one-off shape here; extend `fields` upstream.
 */
export function ChatStructuredCard({ data, className }: ChatStructuredCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-surface p-3 text-sm",
        className
      )}
    >
      <p className="font-semibold text-foreground">{data.title}</p>
      {data.subtitle && <p className="mt-0.5 text-xs text-foreground-muted">{data.subtitle}</p>}

      <dl className="mt-2 space-y-1.5">
        {data.fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-3">
            <dt className="text-xs text-foreground-muted">{field.label}</dt>
            <dd
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                STATUS_CLASSES[field.status ?? "neutral"]
              )}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
