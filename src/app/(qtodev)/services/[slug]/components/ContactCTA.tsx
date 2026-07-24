import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ContactCTAProps {
  /** When true, skip outer section/Container (parent owns layout) */
  embedded?: boolean;
}

export function ContactCTA({ embedded = false }: ContactCTAProps) {
  const content = (
    <Reveal staggerSelector="[data-reveal]">
      <div
        className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/5 ring-1 ring-black/[0.03] md:p-10"
        data-reveal
      >
        <SectionHeader
          subtitle="Next step"
          subtitleClassName="text-primary font-semibold tracking-[0.2em]"
          subtitlePill
          title="Ready to Build Your Web Application?"
          description="Share your goals and constraints. We reply with clear next steps within one business day."
          headingId="contact-cta-heading"
          centered={false}
        />

        <ul className="mt-6 space-y-2.5 text-sm text-foreground-muted">
          <li className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
              <AppIcon name="check" size="sm" className="!text-[8px]" />
            </span>
            Fast reply and clear next steps
          </li>
          <li className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
              <AppIcon name="check" size="sm" className="!text-[8px]" />
            </span>
            No long contracts required
          </li>
          <li className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
              <AppIcon name="check" size="sm" className="!text-[8px]" />
            </span>
            Transparent pricing and delivery model
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/requirements"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Start Your Project
            <AppIcon name="arrow-right" size="sm" className="!text-xs" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </Reveal>
  );

  if (embedded) {
    return <div aria-labelledby="contact-cta-heading">{content}</div>;
  }

  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="contact-cta-heading"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <Container size="xl" className="relative">
        {content}
      </Container>
    </section>
  );
}
