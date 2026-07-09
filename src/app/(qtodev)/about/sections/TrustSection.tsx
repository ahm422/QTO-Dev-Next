"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";

type AboutPageConfigType = typeof aboutPageConfig;

const HEADING_ID = "about-trust-heading";

export function TrustSection({ config }: { readonly config?: AboutPageConfigType }) {
  const cfg = config ?? aboutPageConfig;
  const { trust } = cfg;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface-muted border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-[520px] h-[360px] rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[420px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={trust.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={trust.title}
              titleHighlight={trust.titleHighlight}
              description={trust.description}
              headingId={HEADING_ID}
            />
          </div>

          <ul
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
            aria-label="Why clients trust us"
          >
            {trust.reasons.map((reason) => (
              <li
                key={reason}
                data-reveal
                className="flex items-start gap-3 text-sm text-foreground-muted"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AppIcon name="check" size="sm" />
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
