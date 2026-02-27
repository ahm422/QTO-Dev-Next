import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface TechStackStripProps {
  project: Project;
}

export function TechStackStrip({ project }: TechStackStripProps) {
  const items = project.technologiesLogos?.length ? project.technologiesLogos : project.techStack;

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24" aria-labelledby="technologies-heading">
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-primary/[0.04] blur-[80px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="text-center">
            <SectionHeader
              subtitle="Tech Stack"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Technologies"
              description="Chosen for scalability, security, and maintainability."
              headingId="technologies-heading"
              centered
            />
          </div>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            data-reveal
          >
            {items.map((tech) => (
              <div
                key={tech}
                className="group flex items-center gap-2.5 rounded-xl border border-border bg-surface px-5 py-3.5 text-sm font-medium text-foreground-muted shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground hover:shadow-lg hover:ring-primary/15"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <AppIcon name="gear" size="sm" className="!text-[10px]" />
                </span>
                {tech}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
