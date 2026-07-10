"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import type { Job } from "@/types/job";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { getDepartmentAccent } from "@/lib/careers/departmentAccent";
import { JobApplyDialog } from "@/components/careers/JobApplyDialog";

const HEADING_ID = "open-roles-heading";

function getDisplayLocation(job: Job): string {
  if (job.workMode === "Remote-friendly") {
    return `${job.location}`;
  }

  if (job.workMode === "Remote") {
    return `Remote — ${job.location}`;
  }

  if (job.workMode === "Hybrid") {
    return `${job.location}`;
  }

  return job.location;
}

function jobIcon(job: Job): AppIconName {
  return job.icon ?? "building";
}

function JobCard({ job }: { job: Job }) {
  const icon = jobIcon(job);
  const accent = getDepartmentAccent(job.department);
  const responsibilities = job.responsibilities?.slice(0, 3) ?? [];
  const requirementsPreview = job.requirements?.slice(0, 2) ?? [];
  const moreReq =
    job.requirements && job.requirements.length > 2
      ? job.requirements.length - 2
      : 0;

  return (
    <li className="h-full">
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 border-t-4 bg-gradient-to-b from-background via-background to-surface-muted/40",
          accent.border,
          "shadow-md shadow-black/[0.04] ring-1 ring-black/[0.03] transition-all duration-300",
          "hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 dark:ring-white/[0.05]"
        )}
      >
        <div className="relative overflow-hidden border-b border-border/60 bg-surface-muted/50 px-5 py-5 sm:px-6 sm:py-6">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.09] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner ring-1",
                  accent.iconBg
                )}
                aria-hidden
              >
                <AppIcon name={icon} size="base" className="!text-[20px]" />
              </span>
              <div className="min-w-0 space-y-1">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {job.title}
                </h3>
                <p
                  className={cn(
                    "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-sm font-medium ring-1",
                    accent.badge
                  )}
                >
                  {job.department}
                </p>
              </div>
            </div>
            {job.postedLabel ? (
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                <AppIcon name="calendar" size="sm" className="!text-[10px] text-primary" />
                {job.postedLabel}
              </span>
            ) : null}
          </div>

          <div className="relative mt-4 flex flex-wrap gap-2">
            {job.workMode ? (
              <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border/70">
                {job.workMode}
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border/70">
              {job.employmentType}
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border/70">
              <AppIcon name="location-dot" size="sm" className="!text-[10px] text-primary shrink-0" />
              <span className="truncate">{getDisplayLocation(job)}</span>
            </span>
            {job.experience ? (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/15">
                {job.experience}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
          {job.compensationNote ? (
            <p className="text-xs font-medium text-foreground-muted sm:text-sm">
              {job.compensationNote}
            </p>
          ) : null}

          {job.roleSummary ? (
            <p className="mt-3 text-sm leading-relaxed text-foreground sm:text-[15px]">
              {job.roleSummary}
            </p>
          ) : job.description ? (
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted sm:text-[15px]">
              {job.description}
            </p>
          ) : null}

          {responsibilities.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                What you&apos;ll do
              </p>
              <ul className="mt-2.5 space-y-2">
                {responsibilities.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-snug text-foreground-muted">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-success/12 text-success">
                      <AppIcon name="check" size="sm" className="!text-[9px]" />
                    </span>
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {requirementsPreview.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                What we&apos;re looking for
              </p>
              <ul className="mt-2.5 space-y-2">
                {requirementsPreview.map((line) => (
                  <li key={line} className="flex gap-2 text-sm leading-snug text-foreground-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
              {moreReq > 0 ? (
                <p className="mt-2 text-xs text-foreground-muted/90">
                  +{moreReq} more requirements listed in the full role description.
                </p>
              ) : null}
            </div>
          ) : null}

          {job.tags && job.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-border/60 pt-4">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-lg border border-border/70 bg-surface-muted/80 px-2.5 py-1 text-xs font-medium text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-auto border-t border-border/70 bg-surface-muted/40 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <JobApplyDialog
              job={{
                id: job.id,
                title: job.title,
                department: job.department,
                location: job.location,
                employmentType: job.employmentType,
              }}
            />
          </div>
        </div>
      </article>
    </li>
  );
}

export function OpenPositionsSectionClient({ jobs }: { jobs: Job[] }) {
  const hasJobs = jobs.length > 0;

  return (
    <section
      id="open-roles"
      className="relative overflow-hidden border-y border-border/70 bg-background py-20 md:py-28 lg:py-32"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-[-10%] h-80 w-[480px] rounded-full bg-primary/[0.05] blur-[110px]"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16" data-reveal>
            <SectionHeader
              subtitle="OPEN POSITIONS"
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title="Roles We’re Hiring For"
              titleHighlight="Hiring"
              description={
                hasJobs
                  ? "Live openings below. Click Apply now on any role to submit your application directly."
                  : "We're not actively hiring right now, but we'd love to hear from you."
              }
              headingId={HEADING_ID}
            />
          </div>

          {hasJobs ? (
            <>
              <div
                data-reveal
                className="mx-auto mb-10 max-w-4xl rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] via-background to-primary/[0.04] p-5 shadow-sm md:flex md:items-center md:gap-6 md:p-6"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <AppIcon name="globe" size="sm" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground sm:text-base">
                      Apply on this page
                    </p>
                    <p className="mt-1 text-sm text-foreground-muted leading-snug">
                      Use the Apply now button on each role — takes about 2 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <ul
                className="mx-auto grid max-w-6xl grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8"
                data-reveal
                aria-label="Open roles"
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </ul>
            </>
          ) : (
            <div
              className={cn(
                "mx-auto max-w-2xl rounded-2xl border border-dashed border-border/80 bg-surface-muted/50",
                "p-8 text-center shadow-sm shadow-black/5 ring-1 ring-black/[0.03]"
              )}
              data-reveal
            >
              <h3 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                No Open Roles Right Now
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted sm:text-base">
                We&apos;re not actively hiring for specific roles at the moment, but we&apos;d still love to hear from you.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/contact"
                  className={cn(
                    "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold",
                    "hover:border-primary/25 hover:bg-surface-muted"
                  )}
                >
                  Get in touch
                </Link>
              </div>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
