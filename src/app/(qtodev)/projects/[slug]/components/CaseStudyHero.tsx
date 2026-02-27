import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface CaseStudyHeroProps {
  project: Project;
  blurDataURL: string;
}

export function CaseStudyHero({ project, blurDataURL }: CaseStudyHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-background to-background pb-16 pt-16 md:pb-20 md:pt-20 lg:pb-24 lg:pt-24">
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-0 h-80 w-80 rounded-full bg-primary/[0.04] blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/[0.03] blur-[60px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="rounded px-1 py-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-foreground-muted/40">/</li>
            <li>
              <Link href="/projects" className="rounded px-1 py-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Projects
              </Link>
            </li>
            <li aria-hidden="true" className="text-foreground-muted/40">/</li>
            <li className="truncate font-medium text-foreground">{project.title}</li>
          </ol>
        </nav>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.08]">
              {project.title}
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-foreground-muted sm:text-lg md:mt-6 md:text-xl">
              {project.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
              {project.chips.map((chip) => (
                <span
                  key={`${chip.label}-${chip.value}`}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground-muted ring-1 ring-primary/10 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
                >
                  {chip.label}: {chip.value}
                </span>
              ))}
            </div>

            {project.outcomes?.length ? (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mt-8">
                {project.outcomes.slice(0, 3).map((outcome) => (
                  <div
                    key={outcome}
                    className="flex items-start gap-2.5 rounded-xl border border-success/20 bg-success/5 px-3 py-2.5"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <AppIcon name="check" size="sm" className="!text-xs" />
                    </span>
                    <span className="text-xs font-medium leading-snug text-foreground-muted">{outcome}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
              <Link
                href="/contact?intent=start-similar-project"
                aria-label="Start a similar project"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start a Similar Project
                <AppIcon name="arrow-right" size="sm" className="!text-sm" />
              </Link>
              <Link
                href={project.demoUrl ?? "/projects"}
                aria-label={project.demoUrl ? "View live demo or request demo" : "See more case studies"}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {project.demoUrl ? "View Live / Request Demo" : "See More Case Studies"}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10 ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 hover:shadow-2xl hover:ring-primary/20 lg:rounded-3xl">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={project.heroImage.url}
                  alt={project.heroImage.alt}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
