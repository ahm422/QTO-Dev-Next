"use client";

import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";

const HEADING_ID = "about-company-snapshot-heading";

const STATS = [
  { label: "Product Engineering Roots", value: "Built from the ground up" },
  { label: "Enterprise-Grade Delivery", value: "Battle-tested delivery discipline" },
  { label: "Long-Term Partnerships", value: "Relationships that grow with you" },
] as const;

export function CompanySnapshotSection() {
  const { companySnapshot } = aboutPageConfig;

  return (
    <section
      className="relative py-24 md:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-surface-muted to-surface-muted border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
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
              subtitle={companySnapshot.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={companySnapshot.title}
              titleHighlight={companySnapshot.titleHighlight}
              description={companySnapshot.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-12 mb-14">
            {STATS.map((stat, i) => (
              <div key={stat.label} data-reveal>
                <Card className="group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/70">
                  <div className="relative flex h-full flex-col items-center justify-center px-6 py-7 md:px-8 md:py-9 text-center">
                    <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary/70">
                      {stat.label}
                    </div>
                    <div className="text-lg md:text-xl font-semibold text-foreground font-heading leading-snug max-w-xs">
                      {stat.value}
                    </div>
                    <span className="mt-3 h-px w-10 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-60 group-hover:opacity-100 group-hover:w-14 transition-all duration-300" />
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div data-reveal>
            <Card className="p-8 md:p-10 rounded-2xl bg-surface border border-border/80 shadow-sm md:text-center">
              <p className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-3xl mx-auto">
                <span className="font-semibold text-foreground">
                  Our journey began with a small team of engineers obsessed with solving hard
                  problems the right way.
                </span>
                <span className="block mt-3">
                  Today, we combine that same{" "}
                  <span className="font-semibold text-primary">builder mindset</span> with{" "}
                  <span className="font-semibold text-primary">mature delivery practices</span> to
                  help organizations modernize systems, launch new products, and create digital
                  experiences that stand the test of time.
                </span>
              </p>
            </Card>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
