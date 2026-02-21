import Image from "next/image";
import Link from "next/link";
import { Project } from "@/content/projects/types";

interface TestimonialBlockProps {
  project: Project;
}

export function TestimonialBlock({ project }: TestimonialBlockProps) {
  if (!project.testimonial) return null;

  return (
    <section className="bg-primary py-12 md:py-16 text-primary-foreground" aria-labelledby="testimonial-heading">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 id="testimonial-heading" className="text-2xl font-bold md:text-3xl">Success Story</h2>
          <blockquote className="mt-5 text-lg leading-8 text-primary-foreground/95">
            “{project.testimonial.quote}”
          </blockquote>
          <p className="mt-5 text-sm text-primary-foreground/80">
            <span className="font-semibold text-primary-foreground">{project.testimonial.name}</span> · {project.testimonial.role}, {project.testimonial.company}
          </p>

          <div className="mt-7 flex items-center gap-4">
            <p className="text-sm text-primary-foreground/80">Want results like this?</p>
            <Link
              href="/contact?intent=book-call"
              aria-label="Book a call"
              className="inline-flex items-center rounded-lg bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary hover:opacity-90"
            >
              Book a Call
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
          {project.testimonial.image ? (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={project.testimonial.image}
                alt={`${project.testimonial.name} portrait`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-sm text-primary-foreground/80">Video / Image Placeholder</div>
          )}
        </div>
      </div>
    </section>
  );
}
