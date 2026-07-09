"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";
import { cn } from "@/components/theme/cn";

type AboutPageConfigType = typeof aboutPageConfig;
type TimelineItem = (typeof aboutPageConfig.companySnapshot.timeline)[number];

const HEADING_ID = "about-company-snapshot-heading";

function getTimelineLayout(count: number) {
  if (count <= 2) {
    return { lineInset: "left-[25%] right-[25%]", gridCols: "lg:grid-cols-2" };
  }
  if (count === 3) {
    return { lineInset: "left-[16.67%] right-[16.67%]", gridCols: "lg:grid-cols-3" };
  }
  return { lineInset: "left-[12.5%] right-[12.5%]", gridCols: "lg:grid-cols-4" };
}

function TimelineMilestoneCard({ item }: { readonly item: TimelineItem }) {
  return (
    <div
      className={cn(
        "group relative flex h-full min-h-[200px] flex-col rounded-2xl border border-border/80 bg-surface p-6 shadow-sm md:min-h-[220px] md:p-7",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
      )}
    >
      <span className="process-timeline-node mb-4 inline-flex items-center rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        {item.year}
      </span>
      <h3 className="font-heading text-lg font-semibold text-foreground md:text-xl">
        {item.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted md:text-base">
        {item.description}
      </p>
    </div>
  );
}

export function CompanySnapshotSectionClient({
  config,
}: {
  readonly config?: AboutPageConfigType;
}) {
  const cfg = config ?? aboutPageConfig;
  const { companySnapshot } = cfg;
  const stats = companySnapshot.stats ?? aboutPageConfig.companySnapshot.stats;
  const timeline = companySnapshot.timeline ?? aboutPageConfig.companySnapshot.timeline;
  const journeyNarrative =
    companySnapshot.journeyNarrative ?? aboutPageConfig.companySnapshot.journeyNarrative;
  const timelineCount = timeline.length;
  const { lineInset: desktopLineInset, gridCols: desktopGridCols } =
    getTimelineLayout(timelineCount);

  return (
    <section
      className="relative py-24 md:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/5 via-surface-muted to-surface-muted border-y border-border"
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
              subtitle={companySnapshot.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={companySnapshot.title}
              titleHighlight={companySnapshot.titleHighlight}
              description={companySnapshot.description}
              headingId={HEADING_ID}
            />
          </div>

          {stats.length > 0 && (
            <div
              data-reveal
              className="mb-14 flex flex-wrap justify-center gap-3"
            >
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-primary/10 px-4 py-2 text-foreground"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                    {stat.label}
                  </span>
                  <span className="text-sm font-semibold">{stat.value}</span>
                </span>
              ))}
            </div>
          )}

          {timeline.length > 0 && (
            <>
              <div data-reveal className="relative mb-14 hidden lg:block">
                <div
                  className={cn(
                    "process-timeline-line pointer-events-none absolute top-[2.75rem] z-0 h-px",
                    desktopLineInset
                  )}
                  aria-hidden
                />
                <ol
                  className={cn(
                    "relative grid list-none gap-8",
                    desktopGridCols
                  )}
                  aria-label="Company journey milestones"
                >
                  {timeline.map((item) => (
                    <li key={`${item.year}-${item.title}`} className="relative z-10">
                      <TimelineMilestoneCard item={item} />
                    </li>
                  ))}
                </ol>
              </div>

              <section
                data-reveal
                className="process-timeline-scroll process-timeline-fade-edges mb-14 lg:hidden"
                aria-label="Company journey milestones"
              >
                <ol className="flex list-none gap-4 snap-x snap-mandatory overflow-x-auto pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {timeline.map((item) => (
                    <li
                      key={`${item.year}-${item.title}`}
                      className="w-[min(85vw,320px)] shrink-0 snap-center"
                    >
                      <TimelineMilestoneCard item={item} />
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          {journeyNarrative && (
            <div data-reveal>
              <Card className="p-8 md:p-10 rounded-2xl bg-surface border border-border/80 shadow-sm md:text-center">
                <p className="text-lg md:text-xl text-foreground-muted leading-relaxed max-w-3xl mx-auto">
                  {journeyNarrative}
                </p>
              </Card>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
