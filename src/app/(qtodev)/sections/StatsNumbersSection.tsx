import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatsAreaChartClient, StatsBarChartClient } from "@/app/(qtodev)/sections/StatsNumbersChartsClient";
import { StatCardClient } from "@/app/(qtodev)/sections/StatCardClient";
import { statsNumbersConfig } from "@/config/statsNumbers";
import { findPublishedStats } from "@/lib/cms/stats";
import { findPageSection } from "@/lib/cms/pageContent";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "stats-numbers-heading";

function ChartPlaceholderCard({
  variant = "bars",
  label,
  className,
  gridClass,
}: {
  variant?: "bars" | "trend";
  label: string;
  className?: string;
  gridClass: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl min-h-[200px] bg-surface-muted/80 dark:bg-white/[0.03] border border-border/80",
        "flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-md",
        gridClass,
        className
      )}
      aria-hidden="true"
    >
      <div className="px-5 pt-4 pb-1">
        <span className="text-xs font-medium uppercase tracking-widest text-foreground-muted">
          {label}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 pt-0">
        {variant === "bars" ? <StatsBarChartClient /> : <StatsAreaChartClient />}
      </div>
    </div>
  );
}

export async function StatsNumbersSection() {
  const [statsNumbersItems, sectionConfig] = await Promise.all([
    findPublishedStats(),
    findPageSection("homepage.stats-header"),
  ]);
  const cfg = (sectionConfig as typeof statsNumbersConfig | null) ?? statsNumbersConfig;
  if (statsNumbersItems.length === 0) return null;
  const [projects, clientSat, countries, years] = statsNumbersItems;

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[420px] h-[320px] rounded-full bg-primary/[0.06] dark:bg-primary/[0.08] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[380px] h-[280px] rounded-full bg-primary/[0.05] dark:bg-primary/[0.06] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <div
        className="absolute left-0 top-0 bottom-0 w-10 md:w-14 pointer-events-none hidden xl:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex gap-1.5 items-end justify-center pb-12">
          {[40, 58, 72, 55, 45].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-primary/10 dark:bg-primary/12 transition-all duration-500"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-10 md:w-14 pointer-events-none hidden xl:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex gap-1.5 items-end justify-center pb-12">
          {[50, 68, 38, 62, 52].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-primary/10 dark:bg-primary/12"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="text-center max-w-2xl mx-auto">
            <SectionHeader
              subtitle={cfg.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title={cfg.title}
              headingId={HEADING_ID}
            />
          </div>

          <div data-reveal className="mt-14 flex flex-col gap-5 md:gap-6 lg:hidden">
            {statsNumbersItems.map((item) => (
              <StatCardClient key={item.id} item={item} />
            ))}
          </div>

          <div data-reveal className="mt-14 hidden lg:grid lg:grid-cols-3 gap-5 md:gap-6 auto-rows-fr">
            <ChartPlaceholderCard
              variant="bars"
              label="Performance"
              gridClass="lg:col-span-2 lg:row-start-1"
            />
            <div className="lg:col-start-3 lg:row-start-1">
              <StatCardClient item={projects} />
            </div>
            <div className="lg:row-start-2 lg:col-start-1">
              <StatCardClient item={clientSat} />
            </div>
            <ChartPlaceholderCard
              variant="trend"
              label="Growth"
              gridClass="lg:row-start-2 lg:col-start-2"
            />
            <div className="lg:row-start-2 lg:col-start-3">
              <StatCardClient item={countries} />
            </div>
            <div className="lg:row-start-3 lg:col-start-1">
              <StatCardClient item={years} />
            </div>
            <ChartPlaceholderCard
              variant="trend"
              label="Trend"
              gridClass="lg:col-span-2 lg:col-start-2 lg:row-start-3"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
