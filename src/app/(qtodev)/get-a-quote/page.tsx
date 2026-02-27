"use client";

import { useState } from "react";
import Link from "next/link";
import { ContactLayout } from "@/components/contact/ContactLayout";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/shared/Text";
import { FormStepper } from "@/components/contact/FormStepper";
import { analytics } from "@/lib/analytics";

type BudgetRange = "<25k" | "25k-75k" | "75k-150k" | ">150k" | "";

interface QuoteFormData {
  projectType: string;
  industry: string;
  companySize: string;
  goals: string;
  budgetRange: BudgetRange;
  startDate: string;
  launchWindow: string;
  urgency: string;
  features: string;
  integrations: string;
  successCriteria: string;
  name: string;
  email: string;
  company: string;
  website: string;
}

type QuoteFormErrors = Partial<Record<keyof QuoteFormData, string>>;

const initialQuoteState: QuoteFormData = {
  projectType: "",
  industry: "",
  companySize: "",
  goals: "",
  budgetRange: "",
  startDate: "",
  launchWindow: "",
  urgency: "",
  features: "",
  integrations: "",
  successCriteria: "",
  name: "",
  email: "",
  company: "",
  website: "",
};

const steps = [
  { id: "project", label: "Project overview" },
  { id: "budget-timeline", label: "Budget & timeline" },
  { id: "details-contact", label: "Details & contact" },
];

export default function GetAQuotePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuoteFormData>(initialQuoteState);
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track basic page view on mount
  useState(() => {
    analytics.trackPageView("/get-a-quote");
    analytics.trackEvent("get_quote_view");
    analytics.trackEvent("get_quote_step_1_start");
    return null;
  });

  const setField = (name: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep = (stepIndex: number): boolean => {
    const nextErrors: QuoteFormErrors = {};

    if (stepIndex === 0) {
      if (!formData.projectType.trim())
        nextErrors.projectType = "Select a project type.";
      if (!formData.goals.trim())
        nextErrors.goals = "Share your high-level goals.";
    } else if (stepIndex === 1) {
      if (!formData.budgetRange)
        nextErrors.budgetRange = "Choose an approximate budget.";
      if (!formData.launchWindow.trim())
        nextErrors.launchWindow = "Share your ideal launch window.";
      if (!formData.urgency.trim())
        nextErrors.urgency = "Select how urgent this is.";
    } else if (stepIndex === 2) {
      if (!formData.features.trim())
        nextErrors.features = "List a few key features.";
      if (!formData.name.trim())
        nextErrors.name = "Please enter your name.";
      if (!formData.email.trim()) {
        nextErrors.email = "Please enter your email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Please enter a valid email address.";
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const goToNext = () => {
    if (!validateStep(currentStep)) {
      analytics.trackEvent("get_quote_step_error", { step: currentStep + 1 });
      return;
    }
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStep);
    analytics.trackEvent("get_quote_step_change", { step: nextStep + 1 });
  };

  const goToPrevious = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    analytics.trackEvent("get_quote_step_change", { step: prevStep + 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackEvent("get_quote_step_3_submit_attempt");

    if (!validateStep(2)) {
      analytics.trackEvent("get_quote_submit_error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "get-quote",
          ...formData,
          message:
            formData.goals ||
            "Get a quote request submitted via Get a Quote page.",
        }),
      });

      if (response.ok) {
        analytics.trackEvent("get_quote_submit_success");
        setSubmitted(true);
        setFormData(initialQuoteState);
        setErrors({});
      } else {
        analytics.trackEvent("get_quote_submit_error");
      }
    } catch {
      analytics.trackEvent("get_quote_submit_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (submitted) {
      return (
        <div className="space-y-3 text-center sm:text-left">
          <Text size="lg" className="font-semibold text-success">
            Thanks for requesting a quote.
          </Text>
          <Text color="muted">
            We’ve received your project details. Expect a structured estimate
            and recommendations from our team within one to two business days.
          </Text>
          <Text size="sm" color="muted">
            Prefer to talk it through?{" "}
            <Link
              href="/book-a-call"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Book a call instead
            </Link>
            .
          </Text>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Text size="sm" color="muted" className="mb-2">
                Tell us what you’re building and why now.
              </Text>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Project type
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={(e) => setField("projectType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    aria-invalid={!!errors.projectType}
                  >
                    <option value="">Select an option</option>
                    <option value="new-build">New web or mobile product</option>
                    <option value="modernisation">
                      Modernising existing product
                    </option>
                    <option value="extension">
                      Feature/module for current product
                    </option>
                    <option value="internal-tool">
                      Internal tool or automation
                    </option>
                  </select>
                  {errors.projectType && (
                    <p className="mt-1 text-sm text-error">
                      {errors.projectType}
                    </p>
                  )}
                </div>
                <FormInput
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={(e) => setField("industry", e.target.value)}
                  placeholder="Fintech, SaaS, Healthcare..."
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Company size"
                name="companySize"
                value={formData.companySize}
                onChange={(e) => setField("companySize", e.target.value)}
                placeholder="e.g. 1–10, 50–200, 200+"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                What are you trying to achieve?
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={(e) => setField("goals", e.target.value)}
                rows={5}
                placeholder="Share the context, problem, and what success would look like."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                aria-invalid={!!errors.goals}
              />
              {errors.goals && (
                <p className="mt-1 text-sm text-error">{errors.goals}</p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <Text size="sm" color="muted" className="mb-2">
              A rough budget and timeline help us shape a realistic proposal.
            </Text>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Budget range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "<25k", label: "Under $25k" },
                    { value: "25k-75k", label: "$25k – $75k" },
                    { value: "75k-150k", label: "$75k – $150k" },
                    { value: ">150k", label: "Above $150k" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setField("budgetRange", option.value as BudgetRange)
                      }
                      className={`rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                        formData.budgetRange === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                      aria-pressed={formData.budgetRange === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.budgetRange && (
                  <p className="mt-1 text-sm text-error">
                    {errors.budgetRange}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <FormInput
                  label="Desired start date"
                  name="startDate"
                  type="text"
                  value={formData.startDate}
                  onChange={(e) => setField("startDate", e.target.value)}
                  placeholder="e.g. Next month, Q3, specific date"
                />
                <FormInput
                  label="Ideal launch window"
                  name="launchWindow"
                  type="text"
                  value={formData.launchWindow}
                  onChange={(e) => setField("launchWindow", e.target.value)}
                  placeholder="e.g. Before Black Friday, within 6 months"
                  error={errors.launchWindow}
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                How urgent is this project?
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "exploring", label: "Exploring options" },
                  { value: "soon", label: "Soon (this quarter)" },
                  { value: "urgent", label: "Urgent (this month)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setField("urgency", option.value)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      formData.urgency === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:border-primary/40"
                    }`}
                    aria-pressed={formData.urgency === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.urgency && (
                <p className="mt-1 text-sm text-error">{errors.urgency}</p>
              )}
            </div>
          </div>
        );
      case 2:
      default:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Key features or requirements
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={(e) => setField("features", e.target.value)}
                rows={4}
                placeholder="List the most important features or flows you have in mind."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                aria-invalid={!!errors.features}
              />
              {errors.features && (
                <p className="mt-1 text-sm text-error">{errors.features}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Critical integrations (optional)"
                name="integrations"
                value={formData.integrations}
                onChange={(e) => setField("integrations", e.target.value)}
                placeholder="e.g. Stripe, HubSpot, internal APIs"
              />
              <FormInput
                label="How will you measure success?"
                name="successCriteria"
                value={formData.successCriteria}
                onChange={(e) => setField("successCriteria", e.target.value)}
                placeholder="e.g. activation rate, revenue, efficiency"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Full name"
                name="name"
                value={formData.name}
                onChange={(e) => setField("name", e.target.value)}
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
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                error={errors.email}
              />
              <FormInput
                label="Company"
                name="company"
                value={formData.company}
                onChange={(e) => setField("company", e.target.value)}
                placeholder="Acme Inc."
              />
              <FormInput
                label="Company website (optional)"
                name="website"
                value={formData.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <main>
      <ContactLayout
        eyebrow="Get a quote"
        title="Receive a clear, no-nonsense project estimate"
        subtitle="Tell us about your project, constraints, and priorities. We’ll come back with an indicative budget, timeline, and approach tailored to your situation."
        size="xl"
        sideContent={
          <>
            <TrustStrip orientation="column" />
            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface-muted/80 p-4 text-sm text-foreground-muted">
              <p className="font-semibold text-foreground">
                How our quotes work
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Turnaround typically within 1–2 business days.</li>
                <li>We include trade-offs and alternative paths where useful.</li>
                <li>No obligation to move forward—this is for clarity first.</li>
              </ul>
              <p className="pt-2 text-xs text-foreground-muted">
                Prefer to explore live?{" "}
                <Link
                  href="/book-a-call"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Book a call instead
                </Link>
                .
              </p>
            </div>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormStepper steps={steps} currentStepIndex={currentStep} />
          {renderStep()}
          {!submitted && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={goToPrevious}
                  >
                    Back
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" size="lg" onClick={goToNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request quote"}
                  </Button>
                )}
              </div>
              <Text size="sm" color="muted">
                We’ll only use your details to follow up on this quote request.
              </Text>
            </div>
          )}
        </form>
      </ContactLayout>
    </main>
  );
}

