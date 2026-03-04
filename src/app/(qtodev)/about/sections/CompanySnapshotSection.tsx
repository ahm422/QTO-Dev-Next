"use client";

import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";

const HEADING_ID = "about-company-snapshot-heading";

const STATS = [
  { label: "Successful Projects Delivered", value: "200+" },
  { label: "Satisfied Clients Worldwide", value: "150+" },
  { label: "Skilled Professionals", value: "45+" },
] as const;

export function CompanySnapshotSection() {
  const { companySnapshot } = aboutPageConfig;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface-muted border-y border-border"
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

          <div className="grid md:grid-cols-4 gap-8 lg:gap-10 mb-12">
            {STATS.map((stat, i) => (
              <div key={stat.label} data-reveal>
                <Card className="p-6 md:p-7 text-center rounded-2xl border border-border bg-surface shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-heading">
                    {stat.value}
                  </div>
                  <p className="text-foreground-muted text-sm md:text-base">
                    {stat.label}
                  </p>
                </Card>
              </div>
            ))}
          </div>

          <div data-reveal>
            <Card className="p-8 md:p-9 rounded-2xl bg-surface border border-border shadow-sm">
              <p className="text-lg text-foreground-muted leading-relaxed">
                At QTO Dev, we focus on secure, scalable, and performance-driven software that helps
                organizations operate smarter and grow faster. From custom web platforms to enterprise
                ERP and automation, our team brings deep technical expertise to every engagement.
              </p>
            </Card>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
