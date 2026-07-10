"use client";

import { useState } from "react";
import { ContactLayout } from "@/components/contact/ContactLayout";
import { TrustStripAnimated } from "@/components/marketing/TrustStripAnimated";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { contactSubmissionSchema } from "@/lib/validators/contact";
import { formatZodFieldErrors } from "@/lib/validators/http";
import type { MetricItem } from "@/components/marketing/TrustStripAnimated";
import {
  firstContactFieldError,
  postContactSubmission,
} from "@/lib/contactApiClient";

interface ContactFormSectionProps {
  metrics?: MetricItem[];
}

export function ContactFormSection({ metrics }: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState<null | { id?: string }>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"name" | "email" | "subject" | "message", string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({
      ...prev,
      [name as keyof typeof prev]: undefined,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const payload = {
      ...formData,
      source: "contact-page",
    };
    const parsed = contactSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const raw = formatZodFieldErrors(parsed.error);
      const next: Partial<
        Record<"name" | "email" | "subject" | "message", string>
      > = {};
      for (const key of ["name", "email", "subject", "message"] as const) {
        const msg = raw[key]?.[0];
        if (msg) next[key] = msg;
      }
      setFieldErrors(next);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postContactSubmission(parsed.data);

      if (result.ok) {
        setSubmitted({});
        setFormData({ name: "", email: "", subject: "", message: "" });
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
    <ContactLayout
      id="contact-form"
      eyebrow="Contact"
      title="Send us a message"
      subtitle="Share a bit about what you’re building and where you need help. We’ll reply with practical next steps."
      size="xl"
      sideContent={
        <div className="space-y-6">
          <TrustStripAnimated metrics={metrics} orientation="column" />
          <div className="rounded-2xl border border-border bg-surface-muted/70 p-4 sm:p-5">
            <p className="text-sm font-semibold text-foreground">
              What happens next
            </p>
            <div className="mt-4 space-y-3 text-sm text-foreground-muted">
              {[
                "We reply within one business day.",
                "You’ll get a clear recommendation and next steps.",
                "If we’re not the right fit, we’ll point you in the right direction.",
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
        </div>
      }
    >
      {submitted ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-success/5 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <div className="border-b border-border/80 bg-success/10 px-4 py-4 sm:px-6 sm:py-5">
            <Text className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              Message received
            </Text>
            <Text
              size="sm"
              color="muted"
              className="mt-1 max-w-xl leading-relaxed"
            >
              Thanks for reaching out. We’ll get back to you shortly.
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
                  If you have more details to add, you can send another message.
                </Text>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setSubmitted(null)}
                >
                  Send another message
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
          {formError ? (
            <Alert variant="destructive" className="p-4">
              <AlertDescription className="m-0">{formError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <FormInput
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
              floatingLabel
              error={fieldErrors.name}
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              floatingLabel
              error={fieldErrors.email}
            />
          </div>

          <FormInput
            label="Subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            floatingLabel
            error={fieldErrors.subject}
          />

          <FormTextarea
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            required
            floatingLabel
            error={fieldErrors.message}
            className="min-h-[140px] resize-y"
          />

          <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              size="lg"
              className="min-w-[200px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
            <Text size="sm" color="muted" className="leading-relaxed">
              We’ll only use your details to reply to this message.
            </Text>
          </div>
        </form>
      )}
    </ContactLayout>
  );
}
