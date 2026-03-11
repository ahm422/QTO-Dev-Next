"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { jobs } from "@/data/jobs";
import type { Job } from "@/types/job";
import { analytics } from "@/lib/analytics";

const HEADING_ID = "open-roles-heading";

function getDisplayLocation(job: Job): string {
  if (job.workMode === "Remote-friendly") {
    return `Remote ${job.location}`;
  }

  if (job.workMode === "Remote") {
    return `Remote — ${job.location}`;
  }

  if (job.workMode === "Hybrid") {
    return `${job.location} (hybrid on-site & remote)`;
  }

  return job.location;
}

function JobCard({ job }: { job: Job }) {
  return (
    <li className="h-full">
      <article
        className={cn(
          "flex h-full flex-col rounded-2xl border border-border/80 bg-background/80",
          "shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/10",
          "transition-all duration-200 hover:-translate-y-0.5"
        )}
      >
        <div className="flex-1 p-5 sm:p-6">
          <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
            {job.title}
          </h3>
          <dl className="mt-3 space-y-1.5 text-sm text-foreground-muted">
            <div className="flex flex-wrap gap-1.5">
              <dt className="font-medium">Department:</dt>
              <dd>{job.department}</dd>
            </div>
            {job.workMode && (
              <div className="flex flex-wrap gap-1.5">
                <dt className="font-medium">Work Mode:</dt>
                <dd>{job.workMode}</dd>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              <dt className="font-medium">Location:</dt>
              <dd>{getDisplayLocation(job)}</dd>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <dt className="font-medium">Type:</dt>
              <dd>{job.employmentType}</dd>
            </div>
          </dl>
          {job.description && (
            <p className="mt-4 text-sm sm:text-base text-foreground-muted leading-relaxed">
              {job.description}
            </p>
          )}
          {job.tags && job.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border/80 bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border/80 bg-surface-muted/60 px-5 py-4 sm:px-6 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-foreground-muted">
            Share a brief note on why you’d love to join QTO Dev and include a few links that best showcase your work.
          </p>
          <Link
            href={job.applyUrl}
            onClick={() => {
              analytics.trackEvent("careers_apply_click", {
                jobId: job.id,
                title: job.title,
                department: job.department,
                location: job.location,
                employmentType: job.employmentType,
                workMode: job.workMode,
              });
            }}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
              "bg-primary text-primary-foreground hover:bg-primary-hover",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            View details / Apply
          </Link>
        </div>
      </article>
    </li>
  );
}

export function OpenPositionsSection() {
  const hasJobs = jobs.length > 0;

  return (
    <section
      id="open-roles"
      className="relative py-20 md:py-28 bg-background"
      aria-labelledby={HEADING_ID}
    >
      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" data-reveal>
            <SectionHeader
              subtitle="OPEN POSITIONS"
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title="Current Opportunities at QTO Dev"
              titleHighlight="Opportunities"
              description={
                hasJobs
                  ? "Explore our current openings. If you don’t see a perfect fit, you can still reach out via the general application below."
                  : "We don’t have active openings right now, but we’re always happy to hear from great people."
              }
              headingId={HEADING_ID}
            />
          </div>

          {hasJobs ? (
            <ul
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
              data-reveal
              aria-label="Open roles"
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </ul>
          ) : (
            <div
              className={cn(
                "mx-auto max-w-2xl rounded-2xl border border-dashed border-border/80 bg-surface-muted/60",
                "p-8 text-center shadow-sm shadow-black/5"
              )}
              data-reveal
            >
              <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
                No Open Roles Right Now
              </h3>
              <p className="mt-3 text-sm sm:text-base text-foreground-muted leading-relaxed">
                We’re not actively hiring for specific roles at the moment, but we’d still love to hear from you.
                Send us your CV and a short note about the kind of work you’d like to do.
              </p>
              <Link
                href="mailto:careers@qtodev.com?subject=General%20Application%20-%20QTO%20Dev"
                className={cn(
                  "mt-5 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold",
                  "bg-primary text-primary-foreground hover:bg-primary-hover",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                Send us your CV
              </Link>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

