import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface ProblemsWeSolveProps {
  service: WebDevelopmentServiceData;
}

const fallbackIcons: AppIconName[] = [
  "list",
  "server",
  "bolt",
  "share-nodes",
  "arrow-trending-up",
  "compass",
];

export function ProblemsWeSolve({ service }: ProblemsWeSolveProps) {
  const cards = service.problemsWeSolve ?? [];
  if (cards.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24"
      aria-labelledby="problems-we-solve-heading"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-80 -translate-x-1/4 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Why clients need this"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Business Problems We Solve"
              description="The operational and product pain points that drive teams to engage us for this service."
              headingId="problems-we-solve-heading"
              centered={false}
            />
          </div>

          <div
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Business problems we solve"
          >
            {cards.map((card, idx) => {
              const iconName = card.icon ?? fallbackIcons[idx % fallbackIcons.length];
              return (
                <article
                  key={card.title}
                  data-reveal
                  role="listitem"
                  className="group flex gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:border-primary/25 hover:shadow-md"
                >
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15"
                    aria-hidden
                  >
                    <AppIcon name={iconName} size="sm" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                      {card.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
