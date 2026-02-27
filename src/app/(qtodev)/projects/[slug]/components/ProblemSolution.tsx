import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ProblemSolutionProps {
  project: Project;
}

export function ProblemSolution({ project }: ProblemSolutionProps) {
  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24" aria-labelledby="problem-solution-heading">
      <div
        className="pointer-events-none absolute top-0 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-primary/[0.04] blur-[100px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Challenge & Solution"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Problem &rarr; Solution"
              headingId="problem-solution-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2" data-reveal>
            <article className="group rounded-2xl border border-error/15 bg-background p-6 shadow-sm ring-1 ring-error/[0.05] transition-all duration-300 hover:shadow-lg hover:ring-error/10 md:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-error/10 text-error">
                  <AppIcon name="shield-halved" size="sm" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">The Challenge</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground-muted">
                {project.problem.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                      <AppIcon name="xmark" size="sm" className="!text-[10px]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="group rounded-2xl border border-success/15 bg-background p-6 shadow-sm ring-1 ring-success/[0.05] transition-all duration-300 hover:shadow-lg hover:ring-success/10 md:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <AppIcon name="rocket" size="sm" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">Our Solution</h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground-muted">
                {project.solution.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <AppIcon name="check" size="sm" className="!text-[10px]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {project.outcomes?.length ? (
            <div className="mt-8 rounded-2xl border border-primary/15 bg-background p-6 shadow-sm ring-1 ring-primary/[0.05] md:p-8" data-reveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AppIcon name="chart-line" size="sm" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">Key Outcomes</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {project.outcomes.map((outcome) => (
                  <div
                    key={outcome}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4 transition-shadow duration-200 hover:shadow-md"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <AppIcon name="bolt" size="sm" className="!text-[10px]" />
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground-muted">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
