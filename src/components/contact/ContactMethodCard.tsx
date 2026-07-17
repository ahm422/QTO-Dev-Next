"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

export interface ContactMethodCardProps {
  icon: AppIconName;
  title: string;
  description: string;
  detail: string;
  href?: string;
  external?: boolean;
}

function getMethodKind(href?: string, external?: boolean): "email" | "phone" | "office" | "other" {
  if (!href) return "other";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (external) return "office";
  return "other";
}

export function ContactMethodCard({
  icon,
  title,
  description,
  detail,
  href,
  external,
}: ContactMethodCardProps) {
  const [copied, setCopied] = useState(false);
  const kind = getMethodKind(href, external);
  const copyValue = kind === "email" || kind === "phone" ? description : null;

  const handleCopy = useCallback(async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  }, [copyValue]);

  const cardClass = cn(
    "flex h-full flex-col rounded-2xl border border-border bg-surface p-6 md:p-8",
    "shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md"
  );

  const body = (
    <>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <AppIcon name={icon} size="lg" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-base font-medium text-foreground">{description}</p>
      {detail ? (
        <p className="mt-1 text-sm text-foreground-muted">{detail}</p>
      ) : null}
    </>
  );

  const ctaClass =
    "mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary";

  if (kind === "office" && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(cardClass, "group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
      >
        {body}
        <span className={ctaClass}>
          Open in Maps
          <AppIcon
            name="arrow-right"
            size="sm"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </a>
    );
  }

  if (copyValue) {
    const copyLabel = kind === "email" ? "Copy email" : "Copy number";

    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          cardClass,
          "w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          copied && "border-success/40"
        )}
        aria-label={copied ? `${title} copied to clipboard` : `${copyLabel}: ${copyValue}`}
      >
        {body}
        <span className={cn(ctaClass, copied && "text-success")}>
          {copied ? "Copied" : copyLabel}
          <AppIcon name={copied ? "circle-check" : "arrow-right"} size="sm" />
        </span>
      </button>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(cardClass, "group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
      >
        {body}
      </a>
    );
  }

  return <Card className={cardClass}>{body}</Card>;
}
