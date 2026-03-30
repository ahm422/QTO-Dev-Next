import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

const locations = [
  { label: "USA", value: "+1 (555) 010-1000", icon: "globe" as const },
  { label: "UK", value: "+44 20 3000 9000", icon: "globe" as const },
  { label: "Saudi Arabia", value: "+966 11 000 0000", icon: "globe" as const },
  { label: "Pakistan", value: "+92 300 0000000", icon: "globe" as const },
  { label: "Email", value: "hello@qtodev.com", icon: "envelope" as const },
];

export function ContactCTAWithLocations() {
  return (
    <section
      className="relative overflow-hidden border-y border-border bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="contact-cta-heading"
    >
      <div
        className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/[0.03] blur-[80px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div data-reveal>
              <SectionHeader
                subtitle="Contact"
                subtitleClassName="text-primary font-semibold tracking-[0.2em]"
                subtitlePill
                title="Let's talk about your project"
                description="Share your goals and constraints. We reply within 24 hours."
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
                  href="/contact"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Contact us
                  <AppIcon name="arrow-right" size="sm" className="!text-xs" />
                </Link>
                <Link
                  href="/requirements"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Requirements
                </Link>
              </div>
            </div>

            <aside
              data-reveal
              className="rounded-2xl border border-border bg-surface p-6 shadow-md ring-1 ring-black/[0.03] transition-shadow duration-300 hover:shadow-lg md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AppIcon name="location-dot" size="sm" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">Office Locations</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {locations.map((loc) => (
                  <li
                    key={loc.label}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <AppIcon name={loc.icon} size="sm" className="!text-xs" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{loc.label}</p>
                      <p className="text-sm font-medium text-foreground">{loc.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
