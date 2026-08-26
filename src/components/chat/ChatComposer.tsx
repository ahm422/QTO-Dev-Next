"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/** Text input + send button. Enter sends (Shift+Enter for a newline); disables while sending. */
export function ChatComposer({ onSend, disabled, placeholder = "Type a message…", className }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={cn("flex items-end gap-2 border-t border-border bg-surface p-3", className)}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        aria-label="Message"
        className={cn(
          "max-h-24 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
          "placeholder:text-foreground-muted transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "disabled:opacity-50"
        )}
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition",
          "bg-gradient-to-br from-primary via-primary to-orange-600",
          "hover:scale-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-40 disabled:hover:scale-100",
          "motion-reduce:transition-none motion-reduce:hover:scale-100"
        )}
      >
        <AppIcon name="paper-plane" size="sm" />
      </button>
    </div>
  );
}
