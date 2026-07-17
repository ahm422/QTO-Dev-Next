import { Container } from "@/components/common/Container";
import { StatCardClient } from "@/app/(qtodev)/sections/StatCardClient";
import { findPublishedStats } from "@/lib/cms/stats";
import { cn } from "@/components/theme/cn";

export async function ImpactStatsSection() {
  const stats = await findPublishedStats();
  if (stats.length === 0) return null;

  const displayStats = stats.slice(0, 4);

  return (
    <section
      className={cn(
        "relative overflow-hidden py-12 md:py-16",
        "bg-surface-muted border-y border-border"
      )}
      aria-label="Company impact statistics"
    >
      <Container>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {displayStats.map((item) => (
            <StatCardClient key={item.label} item={item} compact />
          ))}
        </div>
      </Container>
    </section>
  );
}
