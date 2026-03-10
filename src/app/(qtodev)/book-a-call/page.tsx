"use client";

import { useState } from "react";
import { ContactLayout } from "@/components/contact/ContactLayout";
import { TrustStrip } from "@/components/marketing/TrustStrip";
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
import { Text } from "@/components/ui/shared/Text";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { analytics } from "@/lib/analytics";

interface BookCallFormData {
  name: string;
  email: string;
  company: string;
  role: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  preferredTime: string;
  timezone: string;
  channel: string;
  message: string;
}

type BookCallFormErrors = Partial<Record<keyof BookCallFormData, string>>;

const initialFormState: BookCallFormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  projectType: "",
  budgetRange: "",
  timeline: "",
  preferredTime: "",
  timezone: "",
  channel: "",
  message: "",
};

export default function BookACallPage() {
  const [formData, setFormData] = useState<BookCallFormData>(initialFormState);
  const [errors, setErrors] = useState<BookCallFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track basic page view on mount
  useState(() => {
    analytics.trackPageView("/book-a-call");
    analytics.trackEvent("book_call_view");
    return null;
  });

  const validate = (): boolean => {
    const nextErrors: BookCallFormErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!formData.projectType.trim())
      nextErrors.projectType = "Select the type of project.";
    if (!formData.budgetRange.trim())
      nextErrors.budgetRange = "Choose an approximate budget range.";
    if (!formData.timeline.trim())
      nextErrors.timeline = "Share your ideal timeline.";
    if (!formData.message.trim())
      nextErrors.message = "Tell us a bit about your project.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackEvent("book_call_start");

    if (!validate()) {
      analytics.trackEvent("book_call_submit_error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "book-call",
          ...formData,
          message:
            formData.message ||
            "Book a call request submitted via Book a Call page.",
        }),
      });

      if (response.ok) {
        analytics.trackEvent("book_call_submit_success");
        setSubmitted(true);
        setFormData(initialFormState);
        setErrors({});
      } else {
        analytics.trackEvent("book_call_submit_error");
      }
    } catch {
      analytics.trackEvent("book_call_submit_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <ContactLayout
        eyebrow="Book a call"
        title="Strategize your next product move with QTO"
        subtitle="Share a bit about your product and goals. We’ll use this call to understand your context, explore options, and give you a clear next step—no pressure, no jargon."
        size="xl"
        sideContent={
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                <AppIcon name="clock" size="sm" className="!text-[10px]" />
                15–30 min call
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-foreground-muted">
                <AppIcon name="headphones" size="sm" className="!text-[10px]" />
                Senior expert, not sales
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-foreground-muted">
                <AppIcon name="bolt" size="sm" className="!text-[10px]" />
                Follow-up in &lt;24h
              </span>
            </div>

            <TrustStrip orientation="column" />

            <div className="space-y-4 rounded-2xl border border-border/70 bg-surface-muted/80 p-4 sm:p-5 shadow-sm text-sm">
              <p className="font-semibold text-foreground text-[13px] sm:text-sm">
                What to expect on the call
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <AppIcon name="check" size="sm" className="!text-[8px]" />
                  </span>
                  <span className="text-foreground-muted leading-snug">
                    Discovery on goals, constraints, and current product.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <AppIcon name="check" size="sm" className="!text-[8px]" />
                  </span>
                  <span className="text-foreground-muted leading-snug">
                    Concrete ideas on scope, risks, and technical approach.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <AppIcon name="check" size="sm" className="!text-[8px]" />
                  </span>
                  <span className="text-foreground-muted leading-snug">
                    A simple next step you can act on immediately.
                  </span>
                </li>
              </ul>
              <p className="pt-1 text-xs text-foreground-muted/90 leading-relaxed">
                No pressure or hard sell. If we’re not the right fit, we’ll say so and
                point you in the right direction.
              </p>
            </div>
          </div>
        }
      >
        {submitted ? (
          <div className="space-y-3 text-center sm:text-left">
            <Text size="lg" className="font-semibold text-success">
              Thanks for booking a call.
            </Text>
            <Text color="muted">
              We’ve received your request. A member of our team will reach out
              within one business day to confirm the time and share a calendar
              invite.
            </Text>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                Call details
              </p>
              <Text size="sm" color="muted">
                A focused form so we can spend the call on real decisions—not basic
                intake questions.
              </Text>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
              aria-label="Book a call"
            >
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Contact
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    label="Full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                    error={errors.name}
                  />
                  <FormInput
                    label="Work email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    error={errors.email}
                  />
                  <FormInput
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    autoComplete="organization"
                  />
                  <FormInput
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Product Lead, CTO, Founder..."
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              <div className="border-t border-dashed border-border/60 pt-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Project context
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <FormSelect
                    label="Project type"
                    value={formData.projectType}
                    onValueChange={(v) => handleChange({ target: { name: "projectType", value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                    error={errors.projectType}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-build">New product or platform</SelectItem>
                      <SelectItem value="modernisation">Modernising existing product</SelectItem>
                      <SelectItem value="extension">Feature or module extension</SelectItem>
                      <SelectItem value="audit">Architecture or code audit</SelectItem>
                    </SelectContent>
                  </FormSelect>

                  <FormSelect
                    label="Budget range"
                    value={formData.budgetRange}
                    onValueChange={(v) => handleChange({ target: { name: "budgetRange", value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                    error={errors.budgetRange}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<25k">Under $25k</SelectItem>
                      <SelectItem value="25k-75k">$25k – $75k</SelectItem>
                      <SelectItem value="75k-150k">$75k – $150k</SelectItem>
                      <SelectItem value=">150k">Above $150k</SelectItem>
                    </SelectContent>
                  </FormSelect>

                  <FormSelect
                    label="Ideal timeline"
                    value={formData.timeline}
                    onValueChange={(v) => handleChange({ target: { name: "timeline", value: v } } as React.ChangeEvent<HTMLSelectElement>)}
                    error={errors.timeline}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-3-months">Within 1–3 months</SelectItem>
                      <SelectItem value="3-6-months">In 3–6 months</SelectItem>
                      <SelectItem value="6plus">6+ months from now</SelectItem>
                    </SelectContent>
                  </FormSelect>
                </div>
              </div>

              <div className="border-t border-dashed border-border/60 pt-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Call preferences
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <FormInput
                    label="Preferred time of day"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    placeholder="e.g. 9–11am"
                  />
                  <FormInput
                    label="Timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    placeholder="e.g. PST, CET"
                  />
                  <FormInput
                    label="Preferred channel"
                    name="channel"
                    value={formData.channel}
                    onChange={handleChange}
                    placeholder="Zoom, Google Meet, Teams..."
                  />
                </div>
              </div>

              <div className="border-t border-dashed border-border/60 pt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Agenda
                </p>
                <FormTextarea
                  label="What would you like to discuss?"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                    placeholder="Share a short overview of your product, team, and what you’d like help with."
                  required
                  error={errors.message}
                />
              </div>

              <div className="flex flex-col items-stretch gap-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full justify-center rounded-xl px-7 py-3.5 text-base shadow-md shadow-primary/30 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking your call..." : "Book a Call"}
                  {!isSubmitting && (
                    <AppIcon
                      name="arrow-right"
                      size="sm"
                      className="ml-2 !text-[14px]"
                    />
                  )}
                </Button>
                <Text
                  size="sm"
                  color="muted"
                  className="text-xs sm:text-[13px] leading-relaxed text-center sm:text-left"
                >
                  By submitting, you agree to be contacted about this request.
                  We’ll never share your details with third parties.
                </Text>
              </div>
            </form>
          </div>
        )}
      </ContactLayout>
    </main>
  );
}

