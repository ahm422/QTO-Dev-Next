import Image from "next/image";
import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";

interface RelatedProjectsProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function RelatedProjects({ service, blurDataURL }: RelatedProjectsProps) {
  return (
    <section className="bg-surface py-14 md:py-20" aria-labelledby="recent-projects-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="recent-projects-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Projects We’re Proud Of
        </h2>

        <div className="mt-8 overflow-x-auto pb-2">
          <div className="grid min-w-[980px] grid-cols-4 gap-5 lg:min-w-0 lg:grid-cols-4">
            {service.relatedProjects.map((project) => (
              <article key={project.slug} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={project.thumbnail}
                    alt={`${project.name} preview`}
                    fill
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{project.outcome}</p>
                  <Link href={`/projects/${project.slug}`} className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-hover">
                    View Case Study
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            See All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
