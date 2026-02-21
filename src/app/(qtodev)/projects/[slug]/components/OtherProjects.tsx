import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";

interface OtherProjectsProps {
  project: Project;
}

export function OtherProjects({ project }: OtherProjectsProps) {
  if (!project.relatedProjects?.length) return null;

  return (
    <section className="py-12 md:py-16" aria-labelledby="other-projects-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="other-projects-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Other Projects
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {project.relatedProjects.map((item) => (
            <article key={item.slug} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={item.thumbnail}
                  alt={`${item.title} thumbnail`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{item.summary}</p>
                <Link href={`/projects/${item.slug}`} className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-hover">
                  View Case Study →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
