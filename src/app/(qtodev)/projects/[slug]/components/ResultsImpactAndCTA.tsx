import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { RichText } from "@/components/common/RichText";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cmsBodyNeedsRichText } from "@/lib/sanitize-html";

interface ResultsImpactAndCTAProps {
  project: Project;
}

export function ResultsImpactAndCTA({ project }: ResultsImpactAndCTAProps) {
  const outcomes = project.outcomes ?? [];
  const related = (project.relatedProjects ?? []).slice(0, 3);
  const testimonial = project.testimonial;

  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="results-impact-heading"
    >
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-64 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px]"
        aria-hidden
      />

      <Container size="xl" className="relative space-y-14 md:space-y-16">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Results"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Results, Impact & Final CTA"
              description="Measurable outcomes from this engagement, related work, and how to start yours."
              headingId="results-impact-heading"
              centered={false}
            />
          </div>
        </Reveal>

        {outcomes.length > 0 ? (
          <Reveal staggerSelector="[data-reveal]">
            <div
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              data-reveal
              role="list"
              aria-label="Key outcomes"
            >
              {outcomes.map((outcome) => (
                <div
                  key={outcome}
                  role="listitem"
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm ring-1 ring-primary/[0.04]"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <AppIcon name="bolt" size="sm" className="!text-[10px]" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-foreground-muted">
                    {cmsBodyNeedsRichText(outcome) ? (
                      <RichText html={outcome} as="span" />
                    ) : (
                      outcome
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        {testimonial ? (
          <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-xl md:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <AppIcon name="heart" size="sm" className="text-primary-foreground" />
              </span>
              <h3 className="text-xl font-bold">Client feedback</h3>
            </div>
            <blockquote className="mt-5 text-base leading-8 text-primary-foreground/95 md:text-lg">
              {testimonial.quote}
            </blockquote>
            <div className="mt-5 flex items-center gap-3">
              {testimonial.image ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-foreground/20">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} portrait`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-primary-foreground/70">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {related.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-foreground">Related work</h3>
            <p className="mt-1 text-sm text-foreground-muted">
              Supporting case studies from similar engagements.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={`${item.title} thumbnail`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground group-hover:text-primary">
                      {item.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/5 ring-1 ring-black/[0.03] md:p-10">
          <SectionHeader
            subtitle="Next step"
            subtitleClassName="text-primary font-semibold tracking-[0.2em]"
            subtitlePill
            title="Have a Similar Project in Mind?"
            description="Tell us about your goals. We’ll reply with clear next steps within one business day."
            headingId="project-final-cta-heading"
            centered={false}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/requirements"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Start Your Project
              <AppIcon name="arrow-right" size="sm" className="!text-xs" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Book a Consultation
            </Link>
          </div>
          <p className="mt-4 text-xs text-foreground-muted">
            Prefer email?{" "}
            <a
              href="mailto:hello@qtodev.com"
              className="font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              hello@qtodev.com
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
