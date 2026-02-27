import Image from "next/image";
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface TrustSectionProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

export function TrustSection({ service, blurDataURL }: TrustSectionProps) {
  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24" aria-labelledby="trust-heading">
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Trust"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Trusted by ambitious teams"
              description="Teams rely on us for long-term partnerships, dependable delivery, and products that meaningfully move the needle."
              headingId="trust-heading"
              centered={false}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-foreground-muted" data-reveal>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-medium ring-1 ring-primary/10">
              ⭐ 4.9/5 average rating
            </span>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-medium ring-1 ring-primary/10">
              50+ projects delivered
            </span>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-medium ring-1 ring-primary/10">
              Global delivery teams
            </span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {service.testimonials.map((item) => (
              <article
                key={`${item.name}-${item.company}`}
                data-reveal
                className="relative rounded-2xl border border-border bg-surface p-6 shadow-md shadow-black/5 ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-surface"
              >
                <div className="absolute left-0 top-6 h-8 w-1 rounded-r-full bg-primary/40" aria-hidden />
                <div className="flex items-center gap-4 pl-2">
                  <Image
                    src={item.photo}
                    alt={`${item.name} photo`}
                    width={56}
                    height={56}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    className="rounded-xl object-cover ring-1 ring-border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-foreground-muted">{item.role}</p>
                    <p className="text-xs font-medium text-foreground-muted">{item.company}</p>
                  </div>
                </div>
                <p className="mt-4 pl-2 text-sm leading-7 text-foreground-muted">“{item.quote}”</p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
