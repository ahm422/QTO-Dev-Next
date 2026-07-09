"use client";

import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

const DEFAULT_ICONS: AppIconName[] = ["chart-line", "laptop-code", "handshake"];

export interface WorkValueItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export function getWorkValueIcon(item: WorkValueItem, index: number): AppIconName {
  const icon = item.icon as AppIconName | undefined;
  if (icon) return icon;
  return DEFAULT_ICONS[index % DEFAULT_ICONS.length]!;
}

export function ValuePropCard({ item, index }: { item: WorkValueItem; index: number }) {
  const icon = getWorkValueIcon(item, index);

  return (
    <article
      className={cn(
        "group relative rounded-2xl p-[1px] transition-all duration-300",
        "bg-border hover:bg-gradient-to-br hover:from-primary hover:to-cta-gold",
        "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col gap-4 rounded-[calc(1rem-1px)] p-6 md:p-7",
          "bg-surface border border-border/80",
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
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted sm:text-base">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}
