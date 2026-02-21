import Image from "next/image";
import { Project } from "@/content/projects/types";

interface FeatureShowcaseProps {
  project: Project;
}

export function FeatureShowcase({ project }: FeatureShowcaseProps) {
  return (
    <section className="py-12 md:py-16" aria-labelledby="key-features-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="key-features-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Key Features
        </h2>

        <div className="mt-8 space-y-10">
          {project.features.map((feature, index) => {
            const reverse = index % 2 === 1;
            return (
              <article
                key={feature.title}
                className={`grid grid-cols-1 items-center gap-6 rounded-2xl border border-border p-5 md:p-8 lg:grid-cols-2 lg:gap-10 ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-foreground-muted">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm italic text-primary">{feature.benefit}</p>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border bg-surface-muted shadow-lg">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={feature.image.url}
                      alt={feature.image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
