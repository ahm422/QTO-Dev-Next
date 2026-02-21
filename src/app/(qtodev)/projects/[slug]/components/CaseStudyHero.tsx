import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";

interface CaseStudyHeroProps {
  project: Project;
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-surface to-background pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/projects" className="hover:text-foreground">Projects</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">{project.title}</li>
          </ol>
        </nav>

        <div className="mt-6 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-foreground-muted">
              {project.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.chips.map((chip) => (
                <span
                  key={`${chip.label}-${chip.value}`}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted"
                >
                  {chip.label}: {chip.value}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact?intent=start-similar-project"
                aria-label="Start a similar project"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                Start a Similar Project
              </Link>
              <Link
                href={project.demoUrl ?? "/projects"}
                aria-label={project.demoUrl ? "View live demo or request demo" : "See more case studies"}
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
              >
                {project.demoUrl ? "View Live / Request Demo" : "See More Case Studies"}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={project.heroImage.url}
                alt={project.heroImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
