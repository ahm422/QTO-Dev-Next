"use client";

import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { parseStatValue } from "@/lib/parseStatValue";
import { cn } from "@/components/theme/cn";
import type { StatsNumbersItem, StatsNumbersVariant } from "@/types/statsNumbers";

const variantStyles: Record<
  StatsNumbersVariant,
  {
    card: string;
    label: string;
    value: string;
    description: string;
    accent: string;
  }
> = {
  default: {
    card: "bg-background border-border text-foreground shadow-sm hover:shadow-md",
    label: "text-foreground-muted",
    value: "text-foreground",
    description: "text-foreground-muted",
    accent: "bg-primary/80",
  },
  gold: {
    card: "bg-cta-gold border-cta-gold/90 text-cta-gold-foreground shadow-md hover:shadow-lg",
    label: "text-cta-gold-foreground/90",
    value: "text-cta-gold-foreground",
    description: "text-cta-gold-foreground/95",
    accent: "bg-cta-gold-foreground/40",
  },
  dark: {
    card: "bg-[#0c0c0c] dark:bg-black border-white/10 text-white shadow-lg hover:shadow-xl",
    label: "text-white/80",
    value: "text-white",
    description: "text-white/85",
    accent: "bg-primary",
  },
};

export function StatCardClient({ item }: { item: StatsNumbersItem }) {
  const styles = variantStyles[item.variant];
  const parsed = parseStatValue(item.value);

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] border",
        "transition-all duration-300 ease-out hover:-translate-y-0.5",
        styles.card
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-6 bottom-6 w-1 rounded-full opacity-90",
          "group-hover:opacity-100 transition-opacity",
          styles.accent
        )}
        aria-hidden
      />
      <div className="pl-4">
        <h3
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em] mb-3",
            styles.label
          )}
        >
          {item.label}
        </h3>
        <p
          className={cn(
            "font-heading text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums tracking-tight mb-3",
            styles.value
          )}
        >
          {parsed ? (
            <AnimatedCounter
              value={parsed.numeric}
              prefix={parsed.prefix}
              suffix={parsed.suffix}
              label={item.label}
            />
          ) : (
            item.value
          )}
        </p>
        <p className={cn("text-sm leading-relaxed flex-1 max-w-md", styles.description)}>
          {item.description}
        </p>
      </div>
    </div>
  );
}
