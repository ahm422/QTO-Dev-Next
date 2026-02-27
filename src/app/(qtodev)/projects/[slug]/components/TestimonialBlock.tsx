import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface TestimonialBlockProps {
  project: Project;
}

export function TestimonialBlock({ project }: TestimonialBlockProps) {
  if (!project.testimonial) return null;

  return (
    <section
      className="relative overflow-hidden bg-primary py-16 md:py-20 lg:py-24 text-primary-foreground"
      aria-labelledby="testimonial-heading"
    >
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-foreground/[0.05] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary-foreground/[0.03] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/[0.02] blur-[60px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <AppIcon name="heart" size="sm" className="text-primary-foreground" />
              </span>
              <h2 id="testimonial-heading" className="text-2xl font-bold md:text-3xl">
                Success Story
              </h2>
            </div>

            <div className="relative mt-8">
              <span
                className="absolute -top-3 -left-2 text-6xl font-bold leading-none text-primary-foreground/10"
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote className="relative pl-6 text-lg leading-8 text-primary-foreground/95 md:text-xl md:leading-9">
                {project.testimonial.quote}
              </blockquote>
            </div>

            <div className="mt-6 flex items-center gap-4">
              {project.testimonial.image && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-foreground/20">
                  <Image
                    src={project.testimonial.image}
                    alt={`${project.testimonial.name} portrait`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-primary-foreground">
                  {project.testimonial.name}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {project.testimonial.role}, {project.testimonial.company}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-primary-foreground/70">Want results like this?</p>
              <Link
                href="/contact?intent=book-call"
                aria-label="Book a call"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Book a Call
                <AppIcon name="arrow-right" size="sm" className="!text-xs" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 shadow-2xl ring-1 ring-primary-foreground/[0.05]">
              {project.testimonial.image ? (
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={project.testimonial.image}
                    alt={`${project.testimonial.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent"
                  />
                </div>
              ) : (
                <div className="flex aspect-[3/4] flex-col items-center justify-center gap-4 text-primary-foreground/40">
                  <AppIcon name="heart" size="xl" />
                  <span className="text-sm">Client Testimonial</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
