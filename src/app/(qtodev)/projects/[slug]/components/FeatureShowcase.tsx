import Image from "next/image";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface FeatureShowcaseProps {
  project: Project;
  blurDataURL: string;
}

export function FeatureShowcase({ project, blurDataURL }: FeatureShowcaseProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24" aria-labelledby="key-features-heading">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-[600px] -translate-x-1/2 translate-y-1/3 rounded-full bg-primary/[0.03] blur-[100px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Features"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Key Features"
              description="The capabilities that make this project stand out."
              headingId="key-features-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 space-y-8 md:space-y-12">
            {project.features.map((feature, index) => {
              const reverse = index % 2 === 1;
              return (
                <article
                  key={feature.title}
                  data-reveal
                  className={`group grid grid-cols-1 items-center gap-6 rounded-2xl border border-border bg-surface p-5 shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:shadow-xl hover:ring-primary/10 md:gap-10 md:p-8 lg:grid-cols-2 lg:gap-12 ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    </div>
                    <ul className="mt-5 space-y-2.5 text-sm leading-7 text-foreground-muted">
                      {feature.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <span className="mt-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <AppIcon name="check" size="sm" className="!text-[8px]" />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-3.5 py-2.5">
                      <AppIcon name="bolt" size="sm" className="!text-xs text-primary" />
                      <p className="text-sm font-medium text-primary">{feature.benefit}</p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border border-border bg-surface-muted shadow-lg ring-1 ring-black/[0.03] transition-all duration-500 group-hover:shadow-xl group-hover:ring-primary/10">
                    <div className="relative aspect-[4/3] max-h-[400px] w-full overflow-hidden">
                      <Image
                        src={feature.image.url}
                        alt={feature.image.alt}
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
