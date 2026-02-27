import Image from "next/image";
import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface RelatedProjectsProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function RelatedProjects({ service, blurDataURL }: RelatedProjectsProps) {
  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24" aria-labelledby="recent-projects-heading">
      <div
        className="pointer-events-none absolute top-0 left-0 h-64 w-80 rounded-full bg-primary/[0.05] blur-3xl -translate-x-1/4"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Selected work"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Projects we’re proud of"
              description="Representative projects that show how we ship reliable, revenue-focused products."
              headingId="recent-projects-heading"
              centered={false}
            />
          </div>

          {service.relatedProjects.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {service.relatedProjects.map((project) => (
                <article
                  key={project.slug}
                  data-reveal
                  className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-md shadow-black/5 ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-surface"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={project.thumbnail}
                      alt={`${project.name} preview`}
                      fill
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      sizes="(max-width: 1024px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <div className="border-t border-border p-5">
                    <h3 className="text-base font-semibold text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                      {project.outcome}
                    </p>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      View case study
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center" data-reveal>
            <Link
              href="/projects"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              See all projects
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
