"use client";

import { cn } from "@/components/theme/cn";
import type { QuickReply } from "@/types/chat";

interface ChatQuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
  className?: string;
}

/** Row of pill buttons offering canned follow-ups. */
export function ChatQuickReplies({ replies, onSelect, disabled, className }: ChatQuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          className={cn(
            "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground",
            "transition hover:border-primary hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}
