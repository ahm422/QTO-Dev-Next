import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/components/theme/cn";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { findPublishedWorkValues } from "@/lib/cms/workValues";

const HEADING_ID = "projects-value-heading";

export async function ProjectsValueSection({ config }: { config?: ProjectsPageConfigType }) {
  const cfg = config ?? projectsPageConfig;
  const items = await findPublishedWorkValues();
  const { valueSection } = cfg;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-[420px] h-[300px] rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[380px] h-[280px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <div className="mb-12 md:mb-16">
          <SectionHeader
            subtitle={valueSection.subtitle}
            subtitleClassName="text-primary font-semibold tracking-widest"
            subtitlePill
            title={valueSection.title}
            titleHighlight={valueSection.titleHighlight}
            description={valueSection.description}
            headingId={HEADING_ID}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border border-border bg-surface p-6 md:p-7",
                "shadow-sm hover:shadow-md transition-shadow duration-300",
                "flex flex-col"
              )}
            >
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-foreground-muted text-sm md:text-base leading-relaxed flex-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
