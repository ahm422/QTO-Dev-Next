"use client";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/shared/Text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon, MinusIcon } from "lucide-react";

export interface FaqAccordionItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  id?: string;
  controlsId?: string;
  index?: number;
  answerClassName?: string;
}

export function FaqAccordionItem({
  question,
  answer,
  open,
  onToggle,
  id,
  controlsId,
  index,
  answerClassName,
}: FaqAccordionItemProps) {
  return (
    <Accordion
      type="single"
      collapsible
      value={open ? "open" : ""}
      onValueChange={() => onToggle()}
    >
      <AccordionItem
        value="open"
        className={cn(
          "relative rounded-2xl border bg-surface-muted/80 shadow-sm overflow-hidden border-border",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:shadow-md hover:border-primary/25",
          open && "border-primary shadow-md ring-1 ring-primary/15",
          "border-b-0 last:border-b-0"
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-primary transition-all duration-300",
            open ? "opacity-100" : "opacity-0 scale-y-75"
          )}
          aria-hidden
        />

        <AccordionTrigger
          id={id}
          aria-controls={controlsId}
          className={cn(
            "flex w-full items-center gap-4 p-5 sm:p-6 text-left rounded-2xl hover:no-underline",
            "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:bg-primary/[0.04]",
            open && "bg-primary/[0.06]",
            "[&>.size-4]:hidden"
          )}
        >
          {index !== undefined && (
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors duration-300",
                open
                  ? "bg-primary text-primary-foreground border border-primary"
                  : "bg-primary/10 text-primary border border-primary/20"
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
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
              open
                ? "bg-primary text-primary-foreground border border-primary shadow-sm shadow-primary/20"
                : "bg-primary/10 text-primary border border-primary/20"
            )}
            aria-hidden
          >
            {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
          </span>
        </AccordionTrigger>

        <AccordionContent className="pt-0 overflow-hidden">
          <div
            {...(controlsId && { id: controlsId, role: "region" as const, "aria-labelledby": id })}
            className={cn(
              "border-t border-border/80 px-5 sm:px-6 pb-5 sm:pb-6 pt-0",
              "bg-gradient-to-b from-transparent to-primary/[0.03]"
            )}
          >
            <Text size="base" color="muted" className={cn("leading-relaxed pt-3", answerClassName)}>
              {answer}
            </Text>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
