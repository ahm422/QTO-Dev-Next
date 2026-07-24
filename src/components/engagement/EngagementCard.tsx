"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { TiltCard } from "@/components/animations/TiltCard";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/components/theme/cn";

export interface EngagementCardProps {
  optionNumber: string;
  title: string;
  description: string;
  features: string[];
  isPopular: boolean;
  getStartedHref: string;
  getStartedLabel: string;
  mostPopularLabel: string;
}

function ArrowUpRightIcon({ className }: { className?: string }) {
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
      <path d="M6 10L10 6M10 6H6M10 6V10" />
    </svg>
  );
}

function EngagementCardInner({
  optionNumber,
  title,
  description,
  features,
  isPopular,
  getStartedHref,
  getStartedLabel,
  mostPopularLabel,
}: EngagementCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex h-full min-h-0 w-full min-w-0 flex-col",
        "p-6 sm:p-7 lg:p-8",
        "rounded-2xl border border-border/80 bg-card",
        "shadow-md shadow-black/[0.04] dark:shadow-black/20",
        "transition-[transform,box-shadow,border-color] duration-300",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/[0.08]",
        isPopular &&
          "border-primary/40 bg-gradient-to-b from-primary/[0.07] via-card to-card shadow-lg shadow-primary/10 ring-1 ring-primary/20"
      )}
    >
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary to-primary/60 transition-opacity duration-300",
          isPopular ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        aria-hidden
      />

      {isPopular ? (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2" aria-hidden>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest",
              "bg-primary text-primary-foreground shadow-md shadow-primary/25",
              "ring-2 ring-background"
            )}
          >
            {mostPopularLabel}
          </span>
        </div>
      ) : null}

      <div className={cn("flex items-start justify-between gap-3", isPopular && "pt-1")}>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors duration-200",
            isPopular
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-foreground/5 text-foreground-muted group-hover:bg-primary/10 group-hover:text-primary dark:bg-foreground/10"
          )}
          aria-hidden
        >
          {optionNumber.replace("OPTION ", "")}
        </span>
        <span
          className={cn(
            "rounded-lg p-2 text-foreground-muted transition-all duration-200",
            "bg-foreground/5 dark:bg-foreground/10",
            "group-hover:bg-primary/10 group-hover:text-primary group-hover:rotate-12"
          )}
        >
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground-muted sm:text-base">
        {description}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-foreground-muted sm:text-[0.95rem]"
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                "bg-primary/10 text-primary dark:bg-primary/20"
              )}
              aria-hidden
            >
              <AppIcon name="check" size="sm" className="h-3 w-3" />
            </span>
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Link
          href={getStartedHref}
          aria-label={`Get started with ${title}`}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 sm:w-auto",
            "bg-primary text-primary-foreground shadow-md shadow-primary/20",
            "hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          {getStartedLabel}
          <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-80" />
        </Link>
      </div>
    </Card>
  );
}

export function EngagementCard(props: EngagementCardProps) {
  const motionEnabled = useMotionEnabled();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const useTilt = motionEnabled && isDesktop;

  const inner = <EngagementCardInner {...props} />;

  if (useTilt) {
    return (
      <TiltCard className="h-full w-full" maxTilt={5}>
        {inner}
      </TiltCard>
    );
  }

  return inner;
}
