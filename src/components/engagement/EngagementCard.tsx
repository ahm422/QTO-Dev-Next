"use client";

import { Card } from "@/components/ui/shared/Card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { HeaderCTAButton } from "@/components/common/HeaderCTAButton";
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
    <Card className="relative flex flex-col p-6 sm:p-8 h-full">
      {isPopular && (
        <div
          className="absolute top-0 left-0 right-0 flex justify-center pt-3"
          aria-hidden
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {mostPopularLabel}
          </span>
        </div>
      )}

      <div className={cn("flex items-start justify-between gap-2", isPopular && "pt-8")}>
        <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
          {optionNumber}
        </span>
        <span className="text-foreground-muted">
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-4 font-heading text-xl font-bold text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm text-foreground-muted sm:text-base">{description}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-foreground-muted">
            <AppIcon name="check" size="sm" className="mt-0.5 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <HeaderCTAButton
          href={getStartedHref}
          ariaLabel={`Get started with ${title}`}
          className="px-5 py-2.5 text-base"
        >
          {getStartedLabel}
        </HeaderCTAButton>
      </div>
    </Card>
  );
}
