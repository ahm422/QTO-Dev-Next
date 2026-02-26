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
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 8h10" />
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
}: FaqAccordionItemProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-muted shadow-sm transition-shadow",
        "overflow-hidden"
      )}
    >
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
          "flex w-full items-center justify-between gap-4 p-5 text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        )}
      >
        <span className="font-heading text-lg font-semibold text-foreground sm:text-xl">
          {question}
        </span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary",
            "bg-primary/10"
          )}
          aria-hidden
        >
          {open ? (
            <MinusIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </span>
      </button>
      {open && controlsId && (
        <div
          id={controlsId}
          role="region"
          aria-labelledby={id}
          className="border-t border-border px-5 pb-5 pt-2"
        >
          <Text size="base" color="muted" className="leading-relaxed">
            {answer}
          </Text>
        </div>
      )}
    </div>
  );
}
