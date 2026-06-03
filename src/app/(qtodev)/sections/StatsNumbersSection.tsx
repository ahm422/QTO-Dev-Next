import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatsAreaChart, StatsBarChart } from "@/app/(qtodev)/sections/StatsNumbersCharts";
import { statsNumbersConfig } from "@/config/statsNumbers";
import { findPublishedStats } from "@/lib/cms/stats";
import { cn } from "@/components/theme/cn";
import type { StatsNumbersItem, StatsNumbersVariant } from "@/types/statsNumbers";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "stats-numbers-heading";

/** Card variant styles: distinct colors in light and dark theme, always readable. */
const variantStyles: Record<
  StatsNumbersVariant,
  {
    card: string;
    label: string;
    value: string;
    description: string;
    accent: string;
  }
> = {
  default: {
    card: "bg-background border-border text-foreground shadow-sm hover:shadow-md",
    label: "text-foreground-muted",
    value: "text-foreground",
    description: "text-foreground-muted",
    accent: "bg-primary/80",
  },
  gold: {
    card: "bg-cta-gold border-cta-gold/90 text-cta-gold-foreground shadow-md hover:shadow-lg",
    label: "text-cta-gold-foreground/90",
    value: "text-cta-gold-foreground",
    description: "text-cta-gold-foreground/95",
    accent: "bg-cta-gold-foreground/40",
  },
  dark: {
    card: "bg-[#0c0c0c] dark:bg-black border-white/10 text-white shadow-lg hover:shadow-xl",
    label: "text-white/80",
    value: "text-white",
    description: "text-white/85",
    accent: "bg-primary",
  },
};

/** Chart placeholder card with label and Recharts visualization. */
function PlaceholderCard({
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
        {variant === "bars" ? <StatsBarChart /> : <StatsAreaChart />}
      </div>
    </div>
  );
}

/** Stat content card with accent bar, label, value, description. */
function StatCard({ item }: { item: StatsNumbersItem }) {
  const styles = variantStyles[item.variant];
  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 md:p-8 flex flex-col min-h-[200px] border",
        "transition-all duration-300 ease-out hover:-translate-y-0.5",
        styles.card
      )}
    >
      {/* Accent bar */}
      <div
        className={cn(
          "absolute left-0 top-6 bottom-6 w-1 rounded-full opacity-90",
          "group-hover:opacity-100 transition-opacity",
          styles.accent
        )}
        aria-hidden
      />
      <div className="pl-4">
        <h3
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em] mb-3",
            styles.label
          )}
        >
          {item.label}
        </h3>
        <p
          className={cn(
            "font-heading text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums tracking-tight mb-3",
            styles.value
          )}
        >
          {item.value}
        </p>
        <p className={cn("text-sm leading-relaxed flex-1 max-w-md", styles.description)}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

export async function StatsNumbersSection() {
  const statsNumbersItems = await findPublishedStats();
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
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[420px] h-[320px] rounded-full bg-primary/[0.06] dark:bg-primary/[0.08] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[380px] h-[280px] rounded-full bg-primary/[0.05] dark:bg-primary/[0.06] blur-3xl translate-y-1/2"
        aria-hidden
      />

      {/* Decorative vertical bars – subtle, elegant */}
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
              subtitle={statsNumbersConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title={statsNumbersConfig.title}
              headingId={HEADING_ID}
            />
          </div>

          {/* Mobile: single column, 4 cards only */}
          <div data-reveal className="mt-14 flex flex-col gap-5 md:gap-6 lg:hidden">
            {statsNumbersItems.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </div>

          {/* Desktop: bento grid */}
          <div data-reveal className="mt-14 hidden lg:grid lg:grid-cols-3 gap-5 md:gap-6 auto-rows-fr">
            <PlaceholderCard
              variant="bars"
              label="Performance"
              gridClass="lg:col-span-2 lg:row-start-1"
            />
            <div className="lg:col-start-3 lg:row-start-1">
              <StatCard item={projects} />
            </div>
            <div className="lg:row-start-2 lg:col-start-1">
              <StatCard item={clientSat} />
            </div>
            <PlaceholderCard
              variant="trend"
              label="Growth"
              gridClass="lg:row-start-2 lg:col-start-2"
            />
            <div className="lg:row-start-2 lg:col-start-3">
              <StatCard item={countries} />
            </div>
            <div className="lg:row-start-3 lg:col-start-1">
              <StatCard item={years} />
            </div>
            <PlaceholderCard
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
