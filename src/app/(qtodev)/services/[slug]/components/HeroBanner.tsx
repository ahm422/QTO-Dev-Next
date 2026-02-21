import Image from "next/image";
import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";

interface HeroBannerProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function HeroBanner({ service, blurDataURL }: HeroBannerProps) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-surface to-background py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">{service.breadcrumbLabel}</li>
          </ol>
        </nav>

        <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {service.headline}
            </h1>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-foreground-muted md:text-xl">
              {service.subheadline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {service.proofChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact?intent=start-project"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Start Your Project
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                See Recent Work
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
