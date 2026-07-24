import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

/**
 * Legacy standalone CTA (locations-heavy). Project detail IA now uses
 * ResultsImpactAndCTA dual buttons; this file remains for optional reuse.
 */
export function ContactCTAWithLocations() {
  return (
    <section
      className="relative overflow-hidden border-y border-border bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="contact-cta-heading"
    >
      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="max-w-2xl" data-reveal>
            <SectionHeader
              subtitle="Next step"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Have a Similar Project in Mind?"
              description="Share your goals and constraints. We reply within 24 hours."
              headingId="contact-cta-heading"
              centered={false}
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/requirements"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Start Your Project
                <AppIcon name="arrow-right" size="sm" className="!text-xs" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Book a Consultation
              </Link>
            </div>

            <p className="mt-4 text-xs text-foreground-muted">
              Prefer email?{" "}
              <a
                href="mailto:hello@qtodev.com"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                hello@qtodev.com
              </a>
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
