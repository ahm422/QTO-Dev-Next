"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import {
  FormSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contactSubmissionSchema } from "@/lib/validators/contact";
import { formatZodFieldErrors } from "@/lib/validators/http";
import {
  firstContactFieldError,
  postContactSubmission,
} from "@/lib/contactApiClient";

const PROJECT_TYPE_LABELS: Record<string, string> = {
  mvp: "MVP Development",
  saas: "SaaS Platform",
  ecommerce: "E-commerce",
  enterprise: "Enterprise Portal",
  redesign: "UI/UX Redesign",
  maintenance: "Maintenance & Scaling",
};

export function ContactCTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"name" | "email" | "subject" | "message", string>>
  >({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const subjectLabel = projectType
      ? PROJECT_TYPE_LABELS[projectType] ?? projectType
      : null;
    const subject = subjectLabel
      ? `Services inquiry: ${subjectLabel}`
      : "Services page inquiry";

    const metadata: Record<string, string> = {};
    const c = company.trim();
    if (c) metadata.company = c;
    if (projectType) metadata.projectType = projectType;

    const payload = {
      name,
      email,
      message,
      subject,
      source: "services-cta",
      ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
    };

    const parsed = contactSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const raw = formatZodFieldErrors(parsed.error);
      setFieldErrors({
        name: raw.name?.[0],
        email: raw.email?.[0],
        subject: raw.subject?.[0],
        message: raw.message?.[0],
      });
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postContactSubmission(parsed.data);
      if (result.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setCompany("");
        setProjectType("");
        setMessage("");
        setTimeout(() => setSubmitted(false), 6000);
        return;
      }
      setFormError(result.errorMessage);
      if (result.fieldErrors) {
        setFieldErrors({
          name: firstContactFieldError(result.fieldErrors, "name"),
          email: firstContactFieldError(result.fieldErrors, "email"),
          subject: firstContactFieldError(result.fieldErrors, "subject"),
          message: firstContactFieldError(result.fieldErrors, "message"),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="contact-cta-heading">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/5 ring-1 ring-black/[0.03] md:p-10 lg:grid-cols-2 lg:gap-12"
            data-reveal
          >
            <div className="flex flex-col justify-center">
              <SectionHeader
                subtitle="Contact"
                subtitleClassName="text-primary font-semibold tracking-[0.2em]"
                subtitlePill
                title="Ready to build your next big thing?"
                description="Tell us what you are building and where you need help. Our team replies quickly with a practical plan."
                headingId="contact-cta-heading"
                centered={false}
              />
              <ul className="mt-6 space-y-3 text-sm text-foreground-muted">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  Fast reply and clear next steps
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  No long contracts required
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs" aria-hidden>✓</span>
                  Transparent pricing and delivery model
                </li>
              </ul>
            </div>

            {submitted ? (
              <Alert variant="success" className="h-fit rounded-2xl border border-border bg-surface-muted/80 p-6 shadow-inner ring-1 ring-black/[0.03] md:p-7 md:self-center">
                <AlertDescription className="text-success m-0 font-semibold">
                  Thank you! We&apos;ll get back to you within 24 hours.
                </AlertDescription>
              </Alert>
            ) : (
              <form
                className="rounded-2xl border border-border bg-surface-muted/80 p-6 shadow-inner ring-1 ring-black/[0.03] md:p-7"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 gap-4">
                  {formError ? (
                    <Alert variant="destructive" className="p-3">
                      <AlertDescription className="m-0">{formError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <FormInput
                    label="Name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFieldErrors((p) => ({ ...p, name: undefined }));
                      setFormError(null);
                    }}
                    required
                    className="mt-1.5"
                    error={fieldErrors.name}
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((p) => ({ ...p, email: undefined }));
                      setFormError(null);
                    }}
                    required
                    className="mt-1.5"
                    error={fieldErrors.email}
                  />
                  <FormInput
                    label="Company"
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1.5"
                  />
                  <FormSelect
                    label="Project type"
                    value={projectType}
                    onValueChange={(v) => {
                      setProjectType(v);
                      setFormError(null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mvp">MVP Development</SelectItem>
                      <SelectItem value="saas">SaaS Platform</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="enterprise">Enterprise Portal</SelectItem>
                      <SelectItem value="redesign">UI/UX Redesign</SelectItem>
                      <SelectItem value="maintenance">Maintenance &amp; Scaling</SelectItem>
                    </SelectContent>
                  </FormSelect>

                  <FormTextarea
                    label="Message"
                    name="message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setFieldErrors((p) => ({ ...p, message: undefined }));
                      setFormError(null);
                    }}
                    rows={4}
                    required
                    className="mt-1.5"
                    error={fieldErrors.message}
                  />

                  <Button
                    type="submit"
                    className="mt-2 min-h-[44px] w-full sm:w-auto sm:min-h-0 sm:px-6 hover:-translate-y-0.5 hover:shadow-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending…" : "Send message – we reply in <24h"}
                  </Button>

                  <p className="text-center text-xs text-foreground-muted">
                    We reply with clear next steps within one business day.
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
