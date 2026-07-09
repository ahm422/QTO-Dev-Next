"use client";

import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

const DEFAULT_ICONS: AppIconName[] = [
  "rocket",
  "shield-halved",
  "bolt",
  "bullseye",
  "chart-line",
];

export function getBenefitIcon(item: WhyChooseUsItem, index: number): AppIconName {
  return item.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length]!;
}

export function BenefitCard({
  item,
  index,
}: {
  item: WhyChooseUsItem;
  index: number;
}) {
  const icon = getBenefitIcon(item, index);

  return (
    <article
      className={cn(
        "group relative rounded-2xl p-[1px] transition-shadow duration-300",
        "bg-border hover:bg-gradient-to-br hover:from-primary hover:to-cta-gold",
        "hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col gap-4 rounded-[calc(1rem-1px)] p-5 sm:p-6",
          "bg-background border border-border/80",
          "transition-colors duration-300 group-hover:border-transparent"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            "bg-primary/10 text-primary border border-primary/15",
            "transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-105"
          )}
          aria-hidden
        >
          <AppIcon name={icon} size="md" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}
