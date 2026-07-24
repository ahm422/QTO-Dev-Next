import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface OverviewSectionProps {
  service: WebDevelopmentServiceData;
  /** Retained for page.tsx call-site compatibility; unused after deliverable-card IA */
  blurDataURL?: string;
}

const fallbackIcons: AppIconName[] = [
  "laptop-code",
  "rocket",
  "chart-line",
  "cart-shopping",
  "building",
  "gear",
];

export function OverviewSection({ service }: OverviewSectionProps) {
  const cards = service.deliverables ?? [];

  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="what-we-deliver-heading"
    >
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Deliverables"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="What We Deliver"
              description="Concrete products and systems we ship for this service—not generic overview prose."
              headingId="what-we-deliver-heading"
              centered={false}
            />
          </div>

          <div
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Service deliverables"
          >
            {cards.map((card, idx) => {
              const iconName = card.icon ?? fallbackIcons[idx % fallbackIcons.length];
              return (
                <article
                  key={card.title}
                  data-reveal
                  role="listitem"
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-black/[0.03] ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/[0.05]"
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/18"
                    aria-hidden
                  >
                    <AppIcon name={iconName} size="sm" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-muted">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
