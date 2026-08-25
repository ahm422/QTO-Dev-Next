"use client";

import { forwardRef } from "react";
import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ChatLauncherButtonProps {
  open: boolean;
  onClick: () => void;
  unreadCount?: number;
  label: string;
  greeting?: string;
  showGreeting?: boolean;
  onDismissGreeting?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

/** 56–64px circular launcher: icon swap, unread badge, dismissible hover greeting bubble. */
export const ChatLauncherButton = forwardRef<HTMLButtonElement, ChatLauncherButtonProps>(
  function ChatLauncherButton(
    {
      open,
      onClick,
      unreadCount = 0,
      label,
      greeting,
      showGreeting,
      onDismissGreeting,
      onMouseEnter,
      onMouseLeave,
      className,
    },
    ref
  ) {
    return (
      <div className="relative flex items-center">
        {greeting && showGreeting && !open && (
          <div
            role="status"
            className="absolute right-full mr-3 flex max-w-56 items-start gap-2 rounded-2xl rounded-br-sm border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-lg"
          >
            <span className="flex-1">{greeting}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismissGreeting?.();
              }}
              aria-label="Dismiss"
              className="shrink-0 text-foreground-muted hover:text-foreground"
            >
              <AppIcon name="xmark" size="sm" />
            </button>
          </div>
        )}

        <button
          ref={ref}
          type="button"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          aria-label={label}
          aria-expanded={open}
          className={cn(
            "relative flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg",
            "transition hover:scale-105 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
        >
          <AppIcon name={open ? "xmark" : "comment-dots"} size="lg" className="text-white" />

          {!open && unreadCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white"
              aria-label={`${unreadCount} unread messages`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }
);
