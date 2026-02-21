import Image from "next/image";
import { WebDevelopmentServiceData } from "@/content/services/web-development";

interface TrustSectionProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function TrustSection({ service, blurDataURL }: TrustSectionProps) {
  return (
    <section className="bg-surface py-14 md:py-20" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="trust-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Trusted by Ambitious Teams
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-foreground-muted">
          <span className="rounded-full bg-background px-3 py-1 ring-1 ring-border">⭐ 4.9/5 average rating</span>
          <span className="rounded-full bg-background px-3 py-1 ring-1 ring-border">50+ projects delivered</span>
          <span className="rounded-full bg-background px-3 py-1 ring-1 ring-border">Global delivery teams</span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {service.testimonials.map((item) => (
            <article key={`${item.name}-${item.company}`} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src={item.photo}
                  alt={`${item.name} photo`}
                  width={56}
                  height={56}
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-foreground-muted">{item.role}</p>
                  <p className="text-xs text-foreground-muted">{item.company}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-foreground-muted">“{item.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
