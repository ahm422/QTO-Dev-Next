"use client";

import type { ReactNode } from "react";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { Heading } from "@/components/ui/shared/Heading";
import { cn } from "@/components/theme/cn";
import { PageHeroBadge } from "@/components/hero/PageHeroBadge";
import { renderPageHeroTitle } from "@/components/hero/renderPageHeroTitle";

export function PageHeroContent({
  badge,
  title,
  titleHighlight,
  description,
  headingId,
  isMinimal,
  isSplit,
  children,
}: {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  headingId?: string;
  isMinimal: boolean;
  isSplit: boolean;
  children?: ReactNode;
}) {
  const staggeredCopy = (
    <StaggerReveal
      className={cn(
        isSplit
          ? "flex flex-col items-center text-center lg:items-start lg:text-left"
          : "mx-auto flex max-w-2xl flex-col items-center text-center",
        !isSplit && isMinimal && "max-w-3xl"
      )}
      staggerDelay={80}
    >
      {badge && <PageHeroBadge label={badge} />}
      <Heading
        id={headingId}
        level={1}
        className="mb-6 font-heading tracking-tight text-white"
      >
        {renderPageHeroTitle(title, titleHighlight)}
      </Heading>
      {description && (
        <p
          className={cn(
            "max-w-xl text-white/90 leading-relaxed",
            isSplit
              ? "text-lg md:text-xl"
              : isMinimal
                ? "text-lg md:text-xl"
                : "text-xl md:text-2xl"
          )}
        >
          {description}
        </p>
      )}
      {!isSplit && children}
    </StaggerReveal>
  );

  if (isSplit) {
    return (
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {staggeredCopy}
        {children ? <div className="w-full">{children}</div> : null}
      </div>
    );
  }

  return staggeredCopy;
}
