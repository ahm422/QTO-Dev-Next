"use client";

import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

export type ChatTab = "chat" | "contact";

interface ChatTabStripProps {
  active: ChatTab;
  onChange: (tab: ChatTab) => void;
  className?: string;
}

const TABS: { id: ChatTab; label: string; icon: "comment-dots" | "envelope" }[] = [
  { id: "chat", label: "Chat", icon: "comment-dots" },
  { id: "contact", label: "Contact us", icon: "envelope" },
];

/**
 * Segmented pill control switching the panel body between the AI assistant and the
 * lead-capture form — replaces what used to be two separate floating buttons
 * (`ChatLauncherButton` + the old `FloatingContactButton`) with one merged widget.
 * Rendered via `ChatPanel`'s `contextBar` slot.
 */
export function ChatTabStrip({ active, onChange, className }: ChatTabStripProps) {
  return (
    <div
      role="tablist"
      aria-label="Chat widget mode"
      className={cn("border-b border-border bg-surface/60 px-3 py-2 backdrop-blur-sm", className)}
    >
      <div className="relative grid grid-cols-2 gap-1 rounded-full bg-muted/50 p-1">
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-y-1 w-[calc(50%-0.125rem)] rounded-full bg-background shadow-sm ring-1 ring-border transition-transform duration-200 ease-out motion-reduce:transition-none",
            active === "contact" && "translate-x-[calc(100%+0.25rem)]"
          )}
        />
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active === tab.id ? "text-primary" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <AppIcon name={tab.icon} size="sm" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
