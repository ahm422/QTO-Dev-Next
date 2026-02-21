import Image from "next/image";
import { WebDevelopmentServiceData } from "@/content/services/web-development";

interface TechStackStripProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function TechStackStrip({ service, blurDataURL }: TechStackStripProps) {
  return (
    <section className="py-14 md:py-20" aria-labelledby="tech-stack-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="tech-stack-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Technologies We Master
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {service.technologies.map((tech) => (
            <div key={tech} className="rounded-xl border border-border bg-surface p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mx-auto mb-2 h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-muted">
                <Image
                  src="/images/tech-logo.svg"
                  alt={`${tech} logo`}
                  width={40}
                  height={40}
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-foreground-muted">{tech}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm text-foreground-muted">
          Selected for performance, developer velocity, and long-term maintainability.
        </p>
      </div>
    </section>
  );
}
