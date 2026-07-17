"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { ContactUsForm } from "@/components/contact/ContactUsForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fabClassName = cn(
  "inline-flex items-center justify-center gap-2",
  "bg-primary text-white shadow-lg",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "transition hover:scale-105 hover:shadow-xl",
  "motion-reduce:transition-none motion-reduce:hover:scale-100"
);

/**
 * Messenger-style floating contact CTA: click opens a compact form popup;
 * click outside (or the FAB again) closes it.
 * Hidden on /contact so the full page form is used there instead.
 */
export function FloatingContactButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/contact") return null;

  return (
    <div className="fixed z-30 bottom-6 right-4 md:bottom-8 md:right-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={open ? "Close contact form" : "Contact Us"}
            aria-expanded={open}
            className={cn(
              fabClassName,
              "size-14 rounded-full",
              "md:h-12 md:w-auto md:px-5 md:text-sm md:font-semibold"
            )}
          >
            <AppIcon name={open ? "xmark" : "envelope"} size="sm" />
            <span className="hidden md:inline">
              {open ? "Close" : "Contact Us"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          sideOffset={12}
          collisionPadding={16}
          className={cn(
            "w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border-border bg-surface p-0 text-foreground shadow-xl"
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b border-border bg-primary px-4 py-3 text-white">
            <p className="text-sm font-semibold tracking-tight">Send us a message</p>
            <p className="mt-0.5 text-xs text-white/80">
              We usually reply within one business day.
            </p>
          </div>
          <div className="max-h-[min(70vh,28rem)] overflow-y-auto p-4">
            <ContactUsForm source="floating-contact" compact />
          </div>
          <div className="border-t border-border bg-muted/30 px-4 py-3 text-center">
            <Link
              href="/contact#contact-form"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-primary"
            >
              Prefer the full contact page?
              <AppIcon name="arrow-right" size="sm" className="!text-[10px]" />
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
