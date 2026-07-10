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

  if (kind === "office" && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(cardClass, "group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
      >
        <Card className="h-full border-0 bg-transparent p-0 shadow-none">
          {body}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Open in Maps
            <AppIcon name="arrow-right" size="sm" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Card>
      </a>
    );
  }

  if (copyValue) {
    return (
      <Card className={cn(cardClass, "relative")}>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg -m-1 p-1",
            copied && "text-success"
          )}
          aria-label={copied ? `${title} copied to clipboard` : `Copy ${title}: ${copyValue}`}
        >
          {body}
          <p className="mt-3 text-xs font-medium text-primary">
            {copied ? "Copied!" : "Click to copy"}
          </p>
        </button>
        {href ? (
          <a
            href={href}
            className={cn(
              "absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-lg",
              "border border-border bg-background text-foreground-muted",
              "transition-colors hover:border-primary/30 hover:text-primary",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label={kind === "email" ? `Send email to ${copyValue}` : `Call ${copyValue}`}
            onClick={(e) => e.stopPropagation()}
          >
            <AppIcon name={kind === "email" ? "envelope" : "phone"} size="sm" />
          </a>
        ) : null}
      </Card>
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
        <Card className="h-full border-0 bg-transparent p-0 shadow-none">{body}</Card>
      </a>
    );
  }

  return <Card className={cardClass}>{body}</Card>;
}
