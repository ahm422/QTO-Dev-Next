"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { careerApplicationSubmissionSchema } from "@/lib/validators/careers";
import { formatZodFieldErrors } from "@/lib/validators/http";
import {
  firstCareerFieldError,
  postCareerApplication,
} from "@/lib/careersApiClient";
import { careerPortalHomeUrl } from "@/config/careersPortal";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "careers-apply-heading";

export function CareersApplicationSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleInterest: "",
    message: "",
    portfolioUrl: "",
    linkedInUrl: "",
    githubUrl: "",
  });
  const [submitted, setSubmitted] = useState<null | { id?: string }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<
      Record<
        | "name"
        | "email"
        | "roleInterest"
        | "message"
        | "portfolioUrl"
        | "linkedInUrl"
        | "githubUrl",
        string
      >
    >
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name as keyof typeof prev]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const payload = {
      ...formData,
      source: "careers-page",
    };

    const parsed = careerApplicationSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const raw = formatZodFieldErrors(parsed.error);
      const next: typeof fieldErrors = {};
      for (const key of [
        "name",
        "email",
        "roleInterest",
        "message",
        "portfolioUrl",
        "linkedInUrl",
        "githubUrl",
      ] as const) {
        const msg = raw[key]?.[0];
        if (msg) next[key] = msg;
      }
      setFieldErrors(next);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postCareerApplication(parsed.data);
      if (result.ok) {
        setSubmitted({ id: result.id });
        setFormData({
          name: "",
          email: "",
          roleInterest: "",
          message: "",
          portfolioUrl: "",
          linkedInUrl: "",
          githubUrl: "",
        });
        return;
      }

      setFormError(result.errorMessage);
      if (result.fieldErrors) {
        setFieldErrors({
          name: firstCareerFieldError(result.fieldErrors, "name"),
          email: firstCareerFieldError(result.fieldErrors, "email"),
          roleInterest: firstCareerFieldError(result.fieldErrors, "roleInterest"),
          message: firstCareerFieldError(result.fieldErrors, "message"),
          portfolioUrl: firstCareerFieldError(result.fieldErrors, "portfolioUrl"),
          linkedInUrl: firstCareerFieldError(result.fieldErrors, "linkedInUrl"),
          githubUrl: firstCareerFieldError(result.fieldErrors, "githubUrl"),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="apply"
      className="relative overflow-hidden border-y border-border bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[560px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-80 w-[420px] translate-x-1/4 rounded-full bg-primary/[0.03] blur-[110px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <div
          className={cn(
            "mb-10 rounded-2xl border border-border/80 bg-gradient-to-r from-surface-muted/90 via-background to-surface-muted/80",
            "p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5 md:flex md:items-center md:justify-between md:gap-6"
          )}
        >
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <AppIcon name="envelope" size="sm" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Applying for a role listed above?
              </p>
              <p className="mt-1 text-sm text-foreground-muted">
                Use the{" "}
                <a
                  href={careerPortalHomeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  QTO House career portal
                </a>{" "}
                for the full job description and official application. This form is for general
                interest only.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start lg:gap-14">
          <header className="space-y-4">
            <p className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              General application
            </p>
            <div className="space-y-3">
              <Heading id={HEADING_ID} level={2} className="text-3xl sm:text-4xl">
                Tell us what you’d like to work on
              </Heading>
              <Text size="lg" color="muted" className="max-w-2xl leading-relaxed">
                Share your background, interests, and links. We’ll review and follow up if
                there’s a match.
              </Text>
            </div>
            <div className="rounded-2xl border border-border bg-surface-muted/70 p-4 sm:p-5">
              <p className="text-sm font-semibold text-foreground">What to include</p>
              <div className="mt-4 space-y-3 text-sm text-foreground-muted">
                {[
                  "What role or focus area you’re excited about",
                  "A couple of projects you’re proud of",
                  "Links (portfolio / LinkedIn / GitHub) if available",
                ].map((line) => (
                  <div key={line} className="flex gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <AppIcon name="circle-check" size="sm" className="!text-[10px]" />
                    </span>
                    <p className="leading-relaxed">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-muted/60 p-4 shadow-md shadow-black/5 ring-1 ring-black/[0.03] dark:ring-white/[0.04] sm:p-6 md:p-7">
            {submitted ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-success/5 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
                <div className="border-b border-border/80 bg-success/10 px-4 py-4 sm:px-6 sm:py-5">
                  <Text className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    Application submitted
                  </Text>
                  <Text size="sm" color="muted" className="mt-1 leading-relaxed">
                    Thanks for taking the time. We’ll be in touch if there’s a fit.
                  </Text>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="mx-auto inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success sm:mx-0">
                      <AppIcon name="circle-check" size="base" />
                    </span>
                    <div className="space-y-3 text-center sm:text-left">
                      <Text size="lg" className="font-semibold text-success">
                        Thank you.
                      </Text>
                      <Text color="muted" className="leading-relaxed">
                        Want to send another? You can submit again with updated details.
                      </Text>
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={() => setSubmitted(null)}
                      >
                        Submit another application
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" aria-label="Careers application form">
                {formError ? (
                  <Alert variant="destructive" className="p-4">
                    <AlertDescription className="m-0">{formError}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                  <FormInput
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    error={fieldErrors.name}
                    className="h-10 md:h-11"
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    autoComplete="email"
                    required
                    error={fieldErrors.email}
                    className="h-10 md:h-11"
                  />
                </div>

                <FormInput
                  label="Role / interest (optional)"
                  name="roleInterest"
                  value={formData.roleInterest}
                  onChange={handleChange}
                  placeholder="Frontend, backend, product design, QA…"
                  error={fieldErrors.roleInterest}
                  className="h-10 md:h-11"
                />

                <FormTextarea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you’re great at, what you want to learn, and what kind of work you’re looking for."
                  rows={6}
                  required
                  error={fieldErrors.message}
                  className="min-h-[140px] resize-y"
                />

                <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                  <FormInput
                    label="Portfolio URL (optional)"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://…"
                    autoComplete="url"
                    error={fieldErrors.portfolioUrl}
                    className="h-10 md:h-11"
                  />
                  <FormInput
                    label="LinkedIn URL (optional)"
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                    placeholder="https://…"
                    autoComplete="url"
                    error={fieldErrors.linkedInUrl}
                    className="h-10 md:h-11"
                  />
                  <FormInput
                    label="GitHub URL (optional)"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://…"
                    autoComplete="url"
                    error={fieldErrors.githubUrl}
                    className="h-10 md:h-11 md:col-span-2"
                  />
                </div>

                <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" size="lg" className="min-w-[220px]" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting…" : "Submit application"}
                  </Button>
                  <Text size="sm" color="muted" className="leading-relaxed">
                    We’ll only use your details to follow up on this application.
                  </Text>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

