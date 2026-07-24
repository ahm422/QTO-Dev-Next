import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";

interface ServicePackagesProps {
  service: WebDevelopmentServiceData;
}

const serviceAreas = [
  "MVP Development",
  "SaaS Platforms",
  "E-commerce",
  "Enterprise Portals",
  "UI/UX Redesign",
  "Maintenance & Scaling",
];

const areaIcons = ["bolt", "cloud", "cart-shopping", "building", "bullseye", "chart-line"] as const;

export function ServicePackages({ service }: ServicePackagesProps) {
  const popularIndex = service.packages.findIndex((pkg) => pkg.isPopular);

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="service-packages-heading">
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-56 w-72 rounded-full bg-primary/[0.05] blur-3xl translate-y-1/3 translate-x-1/4"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="max-w-3xl">
            <SectionHeader
              subtitle="Packages"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Our web development service packages"
              headingId="service-packages-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {serviceAreas.map((area, idx) => (
              <div
                key={area}
                data-reveal
                className="flex flex-col items-center rounded-xl border border-border bg-surface p-4 text-center text-sm font-medium text-foreground-muted shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"
              >
                <span className="mb-2 rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/15">
                  <AppIcon name={areaIcons[idx]} size="base" />
                </span>
                {area}
              </div>
            ))}
          </div>

          <div
            className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch md:gap-2 md:pt-4"
            data-reveal
          >
            {service.packages.map((pkg, idx) => {
              const popular = popularIndex === idx;

              return (
                <article
                  key={pkg.name}
                  className={cn(
                    "group relative flex h-full min-w-0 flex-col rounded-2xl border bg-surface p-6 transition-all duration-300 md:p-7",
                    popular
                      ? "z-10 border-primary/40 bg-gradient-to-b from-primary/[0.08] via-primary/[0.03] to-transparent shadow-xl shadow-primary/10 ring-2 ring-primary/25 lg:-mt-2 lg:scale-[1.03]"
                      : "border-border/80 shadow-md shadow-black/[0.04] ring-1 ring-black/[0.02]"
                  )}
                >
                  {popular && (
                    <div
                      className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 justify-center"
                      aria-hidden
                    >
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-background">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={cn(popular && "pt-3")}>
                    <h3 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                      {pkg.price}
                    </p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      Timeline: {pkg.timeline}
                    </p>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-snug text-foreground-muted"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                          aria-hidden
                        >
                          <AppIcon name="check" size="sm" className="h-3 w-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-sm text-foreground-muted">
                    <span className="font-semibold text-foreground">Ideal for:</span>{" "}
                    {pkg.idealFor}
                  </p>

                  <Link
                    href="/contact?intent=detailed-proposal"
                    className={cn(
                      "mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                      popular
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl"
                        : "border border-border bg-background text-foreground hover:border-primary/25 hover:bg-primary/5"
                    )}
                  >
                    Get detailed proposal
                  </Link>
                </article>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
