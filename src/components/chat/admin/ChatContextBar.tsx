"use client";

import { cn } from "@/components/theme/cn";

interface ChatContextBarProps {
  ticketId?: string;
  status?: string;
  org?: string;
  className?: string;
}

/**
 * Admin-only context strip under the header: ticket chip, status chip, and
 * right-aligned org. Driven entirely by props/session metadata so real ticket
 * context can be injected later without touching this component.
 */
export function ChatContextBar({ ticketId, status, org, className }: ChatContextBarProps) {
  if (!ticketId && !status && !org) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b border-border bg-surface-muted px-4 py-2 text-xs",
        className
      )}
    >
      {ticketId && (
        <span className="rounded-full bg-[var(--admin-accent-blue)]/15 px-2 py-0.5 font-medium text-[var(--admin-accent-blue)]">
          {ticketId}
        </span>
      )}
      {status && (
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400">
          {status}
        </span>
      )}
      {org && <span className="ml-auto text-foreground-muted">org: {org}</span>}
    </div>
  );
}
