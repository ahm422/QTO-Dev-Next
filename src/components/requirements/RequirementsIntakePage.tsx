"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/shared/Text";
import { FormStepper } from "@/components/contact/FormStepper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { analytics } from "@/lib/analytics";
import { requirementSubmissionSchema } from "@/lib/validators/requirement";
import { firstApiFieldError, formatZodFieldErrors } from "@/lib/validators/http";
import { postRequirementSubmission } from "@/lib/requirementApiClient";

type BudgetRange = "<25k" | "25k-75k" | "75k-150k" | ">150k" | "";

interface RequirementsFormData {
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

type RequirementsFormErrors = Partial<Record<keyof RequirementsFormData, string>>;

const initialState: RequirementsFormData = {
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
] as const;

const FORM_KEYS: (keyof RequirementsFormData)[] = [
  "projectType",
  "industry",
  "companySize",
  "goals",
  "budgetRange",
  "startDate",
  "launchWindow",
  "urgency",
  "features",
  "integrations",
  "successCriteria",
  "name",
  "email",
  "company",
  "website",
];

function buildPayload(data: RequirementsFormData, source: string) {
  return {
    intent: "requirements",
    source,
    name: data.name,
    email: data.email,
    message:
      data.goals.trim() || "Requirements submitted via Requirements page.",
    company: data.company,
    website: data.website,
    projectType: data.projectType,
    industry: data.industry,
    companySize: data.companySize,
    goals: data.goals,
    budgetRange: data.budgetRange,
    startDate: data.startDate,
    launchWindow: data.launchWindow,
    urgency: data.urgency,
    features: data.features,
    integrations: data.integrations,
    successCriteria: data.successCriteria,
  };
}

function zodFieldErrorsToFormErrors(
  raw: Record<string, string[]>
): RequirementsFormErrors {
  const next: RequirementsFormErrors = {};
  for (const key of FORM_KEYS) {
    const msg = raw[key]?.[0];
    if (msg) next[key] = msg;
  }
  const messageErr = raw.message?.[0];
  if (messageErr) next.goals = messageErr;
  return next;
}

function apiFieldErrorsToForm(
  fieldErrors: Record<string, string[]> | undefined
): RequirementsFormErrors {
  const next: RequirementsFormErrors = {};
  for (const key of FORM_KEYS) {
    const msg = firstApiFieldError(fieldErrors, key);
    if (msg) next[key] = msg;
  }
  const messageErr = firstApiFieldError(fieldErrors, "message");
  if (messageErr) next.goals = messageErr;
  return next;
}

export interface RequirementsIntakePageProps {
  analyticsPath: "/requirements" | "/get-a-quote";
  source: "requirements" | "get-a-quote";
  eyebrow: string;
  title: string;
  subtitle: string;
  movedNotice?: { label: string; href: string };
}

export function RequirementsIntakePage({
  analyticsPath,
  source,
  eyebrow,
  title,
  subtitle,
  movedNotice,
}: RequirementsIntakePageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RequirementsFormData>(initialState);
  const [errors, setErrors] = useState<RequirementsFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useState(() => {
    analytics.trackPageView(analyticsPath);
    analytics.trackEvent("requirements_view", { source });
    analytics.trackEvent("requirements_step_1_start", { source });
    return null;
  });

  const setField = (name: keyof RequirementsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError(null);
  };

  const validateStep = (stepIndex: number): boolean => {
    const nextErrors: RequirementsFormErrors = {};

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
      if (!formData.name.trim()) nextErrors.name = "Please enter your name.";
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
      analytics.trackEvent("requirements_step_error", {
        source,
        step: currentStep + 1,
      });
      return;
    }
    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(nextStep);
    analytics.trackEvent("requirements_step_change", {
      source,
      step: nextStep + 1,
    });
  };

  const goToPrevious = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    analytics.trackEvent("requirements_step_change", {
      source,
      step: prevStep + 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackEvent("requirements_step_3_submit_attempt", { source });
    setFormError(null);

    if (!validateStep(2)) {
      analytics.trackEvent("requirements_submit_error", { source });
      return;
    }

    const payload = buildPayload(formData, source);
    const parsed = requirementSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const raw = formatZodFieldErrors(parsed.error);
      setErrors((prev) => ({ ...prev, ...zodFieldErrorsToFormErrors(raw) }));
      setFormError("Please fix the highlighted fields.");
      analytics.trackEvent("requirements_submit_error", { source });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postRequirementSubmission(
        parsed.data as unknown as Record<string, unknown>
      );

      if (result.ok) {
        analytics.trackEvent("requirements_submit_success", { source });
        setSubmitted(true);
        setFormData(initialState);
        setErrors({});
        setFormError(null);
        return;
      }

      analytics.trackEvent("requirements_submit_error", { source });
      setFormError(result.errorMessage);
      if (result.fieldErrors) {
        setErrors((prev) => ({
          ...prev,
          ...apiFieldErrorsToForm(result.fieldErrors),
        }));
      }
    } catch {
      analytics.trackEvent("requirements_submit_error", { source });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (submitted) {
      return (
        <div className="space-y-3 text-center sm:text-left">
          <Text size="lg" className="font-semibold text-success">
            Thanks for sharing your requirements.
          </Text>
          <Text color="muted">
            We’ve received your details. Expect structured follow-up from our
            team within one to two business days.
          </Text>
          <Text size="sm" color="muted">
            Prefer to talk it through?{" "}
            <Link
              href="/contact#book-a-call"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Book a call
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
                <FormSelect
                  label="Project type"
                  value={formData.projectType}
                  onValueChange={(v) => setField("projectType", v)}
                  error={errors.projectType}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-build">
                      New web or mobile product
                    </SelectItem>
                    <SelectItem value="modernisation">
                      Modernising existing product
                    </SelectItem>
                    <SelectItem value="extension">
                      Feature/module for current product
                    </SelectItem>
                    <SelectItem value="internal-tool">
                      Internal tool or automation
                    </SelectItem>
                  </SelectContent>
                </FormSelect>
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

            <FormTextarea
              label="What are you trying to achieve?"
              name="goals"
              value={formData.goals}
              onChange={(e) => setField("goals", e.target.value)}
              rows={5}
              placeholder="Share the context, problem, and what success would look like."
              required
              error={errors.goals}
            />
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
                <Label className="block text-foreground mb-2">
                  Budget range
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "<25k", label: "Under $25k" },
                    { value: "25k-75k", label: "$25k – $75k" },
                    { value: "75k-150k", label: "$75k – $150k" },
                    { value: ">150k", label: "Above $150k" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        formData.budgetRange === option.value
                          ? "default"
                          : "outline"
                      }
                      className="justify-start text-left"
                      onClick={() =>
                        setField("budgetRange", option.value as BudgetRange)
                      }
                      aria-pressed={formData.budgetRange === option.value}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {errors.budgetRange && (
                  <p className="mt-1 text-sm text-destructive">
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
              <Label className="block text-foreground mb-2">
                How urgent is this project?
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "exploring", label: "Exploring options" },
                  { value: "soon", label: "Soon (this quarter)" },
                  { value: "urgent", label: "Urgent (this month)" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={
                      formData.urgency === option.value ? "default" : "outline"
                    }
                    className="rounded-full"
                    onClick={() => setField("urgency", option.value)}
                    aria-pressed={formData.urgency === option.value}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {errors.urgency && (
                <p className="mt-1 text-sm text-destructive">{errors.urgency}</p>
              )}
            </div>
          </div>
        );
      case 2:
      default:
        return (
          <div className="space-y-6">
            <FormTextarea
              label="Key features or requirements"
              name="features"
              value={formData.features}
              onChange={(e) => setField("features", e.target.value)}
              rows={4}
              placeholder="List the most important features or flows you have in mind."
              required
              error={errors.features}
            />

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
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        size="xl"
        sideContent={
          <>
            <TrustStrip orientation="column" />
            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface-muted/80 p-4 text-sm text-foreground-muted">
              <p className="font-semibold text-foreground">
                What happens next
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>We reply in 1–2 business days.</li>
                <li>We’ll highlight trade-offs and realistic next steps.</li>
                <li>No obligation—this is for clarity first.</li>
              </ul>
              <p className="pt-2 text-xs text-foreground-muted">
                Prefer to explore live?{" "}
                <Link
                  href="/contact#book-a-call"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Book a call
                </Link>
                .
              </p>
            </div>
          </>
        }
      >
        {movedNotice ? (
          <Alert className="mb-6">
            <AlertDescription className="m-0">
              {movedNotice.label}{" "}
              <Link
                href={movedNotice.href}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Go to Requirements →
              </Link>
            </AlertDescription>
          </Alert>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!submitted && formError ? (
            <Alert variant="destructive" className="p-4">
              <AlertDescription className="m-0">{formError}</AlertDescription>
            </Alert>
          ) : null}
          <FormStepper steps={[...steps]} currentStepIndex={currentStep} />
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
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Sending…" : "Submit requirements"}
                  </Button>
                )}
              </div>
              <Text size="sm" color="muted">
                We’ll only use your details to follow up on this request.
              </Text>
            </div>
          )}
        </form>
      </ContactLayout>
    </main>
  );
}

