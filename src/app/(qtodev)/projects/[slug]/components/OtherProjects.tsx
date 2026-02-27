import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface OtherProjectsProps {
  project: Project;
}

export function OtherProjects({ project }: OtherProjectsProps) {
  if (!project.relatedProjects?.length) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24" aria-labelledby="other-projects-heading">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-64 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="text-center">
            <SectionHeader
              subtitle="Related Work"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Other Projects"
              description="Explore more case studies from our portfolio."
              headingId="other-projects-heading"
              centered
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {project.relatedProjects.map((item) => (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                data-reveal
                className="group block overflow-hidden rounded-2xl border border-border bg-background shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={`${item.title} thumbnail`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent"
                  />
                  <div className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
                    <AppIcon name="arrow-right" size="sm" className="!text-xs" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted line-clamp-2">
                    {item.summary}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                    View Case Study
                    <AppIcon name="arrow-right" size="sm" className="!text-[10px] transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center" data-reveal>
            <Link
              href="/projects"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              View All Projects
              <AppIcon name="arrow-right" size="sm" className="!text-xs" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
