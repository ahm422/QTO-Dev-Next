"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
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

export function EngagementCard({
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
        "group relative flex flex-col w-full min-w-0 p-8 sm:p-10 lg:p-12 h-full min-h-[420px] sm:min-h-[440px] transition-all duration-300",
        "rounded-2xl border border-border/80",
        "shadow-lg shadow-black/[0.06] dark:shadow-black/20",
        "hover:shadow-xl hover:shadow-primary/[0.08] hover:-translate-y-1 hover:border-primary/20",
        "before:absolute before:inset-0 before:rounded-2xl before:content-[''] before:pointer-events-none before:transition-opacity before:duration-300",
        "before:bg-gradient-to-b before:from-white/40 before:to-transparent before:opacity-0 before:group-hover:opacity-100",
        "dark:before:from-white/5 dark:before:to-transparent",
        isPopular &&
          "relative border-primary/40 bg-gradient-to-b from-primary/[0.08] via-primary/[0.03] to-transparent dark:from-primary/[0.12] dark:via-primary/[0.05] dark:to-transparent shadow-xl shadow-primary/10 ring-2 ring-primary/25 hover:ring-primary/30 lg:z-10 lg:scale-[1.03]"
      )}
    >
      {/* Top accent line (visible on popular, appears on hover for others) */}
      <span
        className={cn(
          "absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-primary to-primary/70 transition-opacity duration-300",
          isPopular ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        aria-hidden
      />

      {isPopular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex justify-center"
          aria-hidden
        >
          <span
            className={cn(
              "inline-flex items-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest",
              "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
              "ring-2 ring-background border border-primary/20"
            )}
          >
            {mostPopularLabel}
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex items-start justify-between gap-3",
          isPopular && "pt-2"
        )}
      >
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold uppercase tracking-wide transition-colors duration-200",
            isPopular
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "bg-foreground/5 text-foreground-muted dark:bg-foreground/10 group-hover:bg-primary/10 group-hover:text-primary"
          )}
          aria-hidden
        >
          {optionNumber.replace("OPTION ", "")}
        </span>
        <span className="rounded-xl p-2.5 bg-foreground/5 dark:bg-foreground/10 text-foreground-muted transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary">
          <ArrowUpRightIcon className="h-5 w-5" />
        </span>
      </div>

      <h3 className="mt-6 font-heading text-2xl font-bold text-foreground sm:text-3xl tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-foreground-muted sm:text-lg">
        {description}
      </p>

      <ul className="mt-8 flex-1 space-y-4">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-4 text-base text-foreground-muted sm:text-lg"
          >
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
                "bg-primary/10 text-primary dark:bg-primary/20"
              )}
              aria-hidden
            >
              <AppIcon name="check" size="sm" className="h-3.5 w-3.5" />
            </span>
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 pt-2">
        <Link
          href={getStartedHref}
          aria-label={`Get started with ${title}`}
          className={cn(
            "inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-base font-semibold transition-all duration-200",
            "bg-primary text-primary-foreground shadow-md shadow-primary/20",
            "hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          {getStartedLabel}
          <ArrowUpRightIcon className="h-4 w-4 opacity-80" />
        </Link>
      </div>
    </Card>
  );
}
