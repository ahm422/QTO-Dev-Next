"use client";

import Link from "next/link";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { cn } from "@/components/theme/cn";

interface CTAProps {
  title: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function CTA({
  title,
  description,
  primaryButtonText = "Get Started",
  primaryButtonHref = "/contact",
  secondaryButtonText,
  secondaryButtonHref,
}: CTAProps) {
  return (
    <section className="relative bg-primary py-20 md:py-24 lg:py-28 overflow-hidden">
      {/* Gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 30% at 20% 70%, rgba(255,255,255,0.04) 0%, transparent 50%)",
        }}
      />
      {/* Soft orbs */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/4 w-[420px] h-[320px] rounded-full bg-white/[0.07] blur-3xl -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 right-1/4 w-[380px] h-[300px] rounded-full bg-white/[0.05] blur-3xl translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          <Heading
            level={2}
            className="text-primary-foreground mb-5 font-heading tracking-tight text-3xl sm:text-4xl md:text-5xl"
          >
            {title}
          </Heading>
          {description && (
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
          {/* Decorative line */}
          <div
            className="mx-auto mb-10 h-px w-20 bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent"
            aria-hidden
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={primaryButtonHref}
              className={cn(
                "group inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl transition-all duration-300",
                "px-7 py-3.5 text-lg",
                "bg-primary-foreground text-primary hover:bg-primary-foreground/95",
                "shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              )}
            >
              {primaryButtonText}
              <AppIcon
                name="arrow-right"
                size="sm"
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            {secondaryButtonText && (
              <Link
                href={secondaryButtonHref || "#"}
                className={cn(
                  "inline-flex items-center justify-center font-semibold rounded-xl border-2 border-primary-foreground/80 text-primary-foreground px-6 py-3 text-base",
                  "hover:bg-primary-foreground/10 transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                )}
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
