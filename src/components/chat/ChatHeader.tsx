"use client";

import type { ReactNode } from "react";
import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  /** Renders a small colored status dot next to the subtitle (e.g. "online"). */
  statusColor?: "green" | "gray";
  /** Small pill next to the title, e.g. a version badge. */
  badge?: string;
  avatar?: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  closeLabel?: string;
  className?: string;
}

/** Shared chat panel header: avatar, title/subtitle, status dot, minimize/close controls. */
export function ChatHeader({
  title,
  subtitle,
  statusColor = "green",
  badge,
  avatar,
  onClose,
  onMinimize,
  closeLabel = "Close chat",
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-t-2xl border-b border-border bg-primary px-4 py-3 text-white",
        className
      )}
    >
      {avatar ?? (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
          <AppIcon name="comment-dots" size="sm" className="text-white" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold tracking-tight">{title}</p>
          {badge && (
            <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium">{badge}</span>
          )}
        </div>
        {subtitle && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
            <span
              className={cn(
                "size-1.5 rounded-full",
                statusColor === "green" ? "bg-green-400" : "bg-white/50"
              )}
              aria-hidden="true"
            />
            {subtitle}
          </p>
        )}
      </div>

      {onMinimize && (
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize chat"
          className="flex size-8 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span className="block h-0.5 w-3 rounded-full bg-white" />
        </button>
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="flex size-8 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <AppIcon name="xmark" size="sm" className="text-white" />
      </button>
    </div>
  );
}
