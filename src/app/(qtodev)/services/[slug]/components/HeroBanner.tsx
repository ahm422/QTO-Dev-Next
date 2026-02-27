import Image from "next/image";
import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";

interface HeroBannerProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function HeroBanner({ service, blurDataURL }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-background to-background py-16 md:py-20 lg:py-24">
      {/* Subtle gradient orbs for depth */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="transition-colors hover:text-foreground">Home</Link></li>
            <li aria-hidden="true" className="opacity-60">/</li>
            <li><Link href="/services" className="transition-colors hover:text-foreground">Services</Link></li>
            <li aria-hidden="true" className="opacity-60">/</li>
            <li className="font-medium text-foreground">{service.breadcrumbLabel}</li>
          </ol>
        </nav>

        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              {service.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-foreground-muted md:text-xl">
              {service.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {service.proofChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-foreground-muted ring-1 ring-primary/10 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact?intent=start-project"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start Your Project
              </Link>
              <Link
                href="/projects"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See Recent Work
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10 ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 hover:shadow-2xl hover:ring-primary/20 lg:rounded-3xl">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={service.heroImage.url}
                  alt={service.heroImage.alt}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
