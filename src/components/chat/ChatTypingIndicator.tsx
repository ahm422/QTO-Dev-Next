"use client";

import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ChatTypingIndicatorProps {
  className?: string;
}

/** Three-dot "assistant is typing" indicator, styled like an assistant bubble. */
export function ChatTypingIndicator({ className }: ChatTypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="mb-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600">
        <AppIcon name="comment-dots" size="sm" className="!text-[11px] text-white" />
      </div>
      <div
        role="status"
        aria-label="Assistant is typing"
        className={cn(
          "flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-3",
          className
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground-muted motion-reduce:animate-none"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
