"use client";

import { cn } from "@/components/theme/cn";
import { Text } from "@/components/ui/shared/Text";

export interface FaqAccordionItemProps {
  /** The question text shown in the card header */
  question: string;
  /** The answer text shown when expanded */
  answer: string;
  /** Whether this item is currently expanded */
  open: boolean;
  /** Called when the user toggles expand/collapse */
  onToggle: () => void;
  /** Optional id for the trigger (e.g. for aria-labelledby on the answer region) */
  id?: string;
  /** Optional id for the answer region (for aria-controls on the trigger) */
  controlsId?: string;
  /** Optional 0-based index for numbering (e.g. 01, 02) */
  index?: number;
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 10h12" />
    </svg>
  );
}

export function FaqAccordionItem({
  question,
  answer,
  open,
  onToggle,
  id,
  controlsId,
  index,
}: FaqAccordionItemProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-surface-muted/80 shadow-sm overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-md hover:border-primary/20",
        open && "border-primary/30 shadow-md ring-1 ring-primary/10",
        "border-border"
      )}
    >
      {/* Left accent bar when open */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-primary transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        aria-hidden
      />

      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={controlsId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          "flex w-full items-center gap-4 p-5 sm:p-6 text-left rounded-2xl",
          "transition-colors duration-200",
          "hover:bg-primary/[0.04]",
          open && "bg-primary/[0.06]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        )}
      >
        {index !== undefined && (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums",
              "bg-primary/10 text-primary border border-primary/20"
            )}
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="font-heading text-lg font-semibold text-foreground sm:text-xl flex-1 min-w-0">
          {question}
        </span>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary",
            "bg-primary/10 border border-primary/20",
            "transition-colors duration-200",
            open && "bg-primary/15 border-primary/30"
          )}
          aria-hidden
        >
          {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
        </span>
      </button>

      {/* Animated answer panel (always in DOM for smooth height transition) */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          {controlsId && (
            <div
              id={controlsId}
              role="region"
              aria-labelledby={id}
              aria-hidden={!open}
              className={cn(
                "border-t border-border/80 px-5 sm:px-6 pb-5 sm:pb-6 pt-0",
                "bg-gradient-to-b from-transparent to-primary/[0.02]"
              )}
            >
              <Text size="base" color="muted" className="leading-relaxed pt-2">
                {answer}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
