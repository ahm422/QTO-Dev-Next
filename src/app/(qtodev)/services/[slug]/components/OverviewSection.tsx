import Image from "next/image";
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface OverviewSectionProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

const iconSet = ["check", "shield-halved", "rocket", "gear", "chart-line", "magnifying-glass"] as const;

export function OverviewSection({ service, blurDataURL }: OverviewSectionProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="overview-heading">
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div data-reveal>
              <SectionHeader
                subtitle="Overview"
                subtitleClassName="text-primary font-semibold tracking-[0.2em]"
                subtitlePill
                title="Why companies choose us for web development"
                headingId="overview-heading"
                centered={false}
              />

              <p className="mt-6 max-w-3xl text-base leading-8 text-foreground-muted">
                {service.overviewText}
              </p>

              <ul className="mt-8 space-y-4">
                {service.overviewBenefits.map((benefit, idx) => (
                  <li key={benefit} className="flex items-start gap-4 rounded-lg border-l-2 border-primary/30 bg-surface/50 py-2 pl-4 pr-3">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20"
                      aria-hidden="true"
                    >
                      <AppIcon name={iconSet[idx % iconSet.length]} size="sm" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground-muted">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-reveal
              className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/5 ring-1 ring-black/[0.03] transition-shadow hover:shadow-2xl lg:rounded-3xl"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={service.overviewImage.url}
                  alt={service.overviewImage.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
