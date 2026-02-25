import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatsAreaChart, StatsBarChart } from "@/app/(qtodev)/sections/StatsNumbersCharts";
import { statsNumbersConfig } from "@/config/statsNumbers";
import { statsNumbersItems } from "@/data/statsNumbers";
import { cn } from "@/components/theme/cn";
import type { StatsNumbersItem, StatsNumbersVariant } from "@/types/statsNumbers";

const HEADING_ID = "stats-numbers-heading";

/** Card variant styles: distinct colors in light and dark theme, always readable. */
const variantStyles: Record<
  StatsNumbersVariant,
  { card: string; label: string; value: string; description: string }
> = {
  default: {
    card:
      "bg-[#F8F4EA] border-[#F8F4EA] text-foreground " +
      "dark:bg-[#2d2a24] dark:border-[#2d2a24] dark:text-[#f5f0e6]",
    label:
      "text-foreground-muted dark:text-[#f5f0e6]/80",
    value: "text-foreground dark:text-[#f5f0e6]",
    description: "text-foreground-muted dark:text-[#f5f0e6]/90",
  },
  gold: {
    card:
      "bg-[#CE9E24] border-[#CE9E24] text-[#1a1a1a] " +
      "dark:bg-[#c4931f] dark:border-[#c4931f] dark:text-[#0f0f0f]",
    label: "text-[#1a1a1a]/80 dark:text-[#0f0f0f]/85",
    value: "text-[#1a1a1a] dark:text-[#0f0f0f]",
    description: "text-[#1a1a1a]/90 dark:text-[#0f0f0f]/90",
  },
  dark: {
    card:
      "bg-[#2A2A2A] border-[#2A2A2A] text-white " +
      "dark:bg-[#252525] dark:border-[#333] dark:text-[#f5f5f5]",
    label: "text-white/80 dark:text-[#f5f5f5]/80",
    value: "text-white dark:text-[#f5f5f5]",
    description: "text-white/90 dark:text-[#f5f5f5]/90",
  },
};

/** Placeholder card with Recharts bar or area chart (stats-themed). */
function PlaceholderCard({
  variant = "bars",
  className,
  gridClass,
}: {
  variant?: "bars" | "trend";
  className?: string;
  gridClass: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl min-h-[200px] bg-[#F8F4EA] border border-[#F8F4EA] flex items-center justify-center p-6",
        "dark:bg-[#2d2a24] dark:border-[#2d2a24]",
        gridClass,
        className
      )}
      aria-hidden="true"
    >
      {variant === "bars" ? <StatsBarChart /> : <StatsAreaChart />}
    </div>
  );
}

/** Stat content card with label, value, description. Uses div (not Card) so variant bg/border/text always win in light and dark mode. */
function StatCard({ item }: { item: StatsNumbersItem }) {
  const styles = variantStyles[item.variant];
  return (
    <div
      className={cn(
        "rounded-xl p-6 md:p-8 flex flex-col min-h-[200px] border shadow-sm",
        styles.card
      )}
    >
      <h3
        className={cn(
          "text-xs font-medium uppercase tracking-wider mb-2",
          styles.label
        )}
      >
        {item.label}
      </h3>
      <p
        className={cn(
          "font-heading text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums mb-3",
          styles.value
        )}
      >
        {item.value}
      </p>
      <p className={cn("text-sm flex-1", styles.description)}>
        {item.description}
      </p>
    </div>
  );
}

export function StatsNumbersSection() {
  const [projects, clientSat, countries, years] = statsNumbersItems;

  return (
    <section
      className="relative py-16 md:py-20 bg-[#FDFDFB] dark:bg-[#0f0f0f] overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      {/* Decorative vertical bars – light beige (light) / subtle (dark) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 md:w-16 pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex gap-2 items-end justify-center pb-8">
          {[35, 55, 70, 55, 40].map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#F8F4EA] dark:bg-white/[0.06]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-12 md:w-16 pointer-events-none hidden lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex gap-2 items-end justify-center pb-8">
          {[45, 65, 35, 60, 50].map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#F8F4EA] dark:bg-white/[0.06]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <Container className="relative">
        <SectionHeader
          subtitle={statsNumbersConfig.subtitle}
          title={statsNumbersConfig.title}
          headingId={HEADING_ID}
        />

        {/* Mobile: single column, 4 cards only */}
        <div className="mt-12 flex flex-col gap-4 md:gap-6 lg:hidden">
          {statsNumbersItems.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </div>

        {/* Desktop: bento grid. Row 1: [placeholder x2] [Projects]; Row 2: [Client Sat] [placeholder] [Countries]; Row 3: [Years] [placeholder x2] */}
        <div className="mt-12 hidden lg:grid lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          <PlaceholderCard variant="bars" gridClass="lg:col-span-2 lg:row-start-1" />
          <div className="lg:col-start-3 lg:row-start-1">
            <StatCard item={projects} />
          </div>
          <div className="lg:row-start-2 lg:col-start-1">
            <StatCard item={clientSat} />
          </div>
          <PlaceholderCard variant="trend" gridClass="lg:row-start-2 lg:col-start-2" />
          <div className="lg:row-start-2 lg:col-start-3">
            <StatCard item={countries} />
          </div>
          <div className="lg:row-start-3 lg:col-start-1">
            <StatCard item={years} />
          </div>
          <PlaceholderCard variant="trend" gridClass="lg:col-span-2 lg:col-start-2 lg:row-start-3" />
        </div>
      </Container>
    </section>
  );
}
