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
import { AppIcon } from "@/components/ui/shared/AppIcon";

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
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-success/5 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
          <div className="border-b border-border/80 bg-success/10 px-4 py-4 sm:px-6 sm:py-5">
            <Text className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              You&apos;re all set
            </Text>
            <Text size="sm" color="muted" className="mt-1 max-w-xl leading-relaxed">
              Your requirements are in our queue. We&apos;ll get back with clear next
              steps.
            </Text>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="mx-auto inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success sm:mx-0">
                <AppIcon name="circle-check" size="base" />
              </span>
              <div className="space-y-3 text-center sm:text-left">
                <Text size="lg" className="font-semibold text-success">
                  Thanks for sharing your requirements.
                </Text>
                <Text color="muted" className="leading-relaxed">
                  Expect structured follow-up from our team within one to two business
                  days.
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
            </div>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-surface-muted/30 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
              <div className="border-b border-border/80 bg-surface-muted/50 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <Text className="text-base font-semibold tracking-tight sm:text-lg">
                      Project overview
                    </Text>
                    <Text size="sm" color="muted" className="max-w-xl leading-relaxed">
                      Tell us what you&apos;re building and why now. High-level detail
                      is enough—we&apos;ll dig deeper later.
                    </Text>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
                    <AppIcon name="compass" size="sm" className="!text-xs text-primary" />
                    ~2 min
                  </span>
                </div>
              </div>

              <div className="space-y-8 p-4 sm:p-6">
                <section className="rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-5 md:p-6">
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="rocket" size="sm" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Context &amp; fit
                      </h3>
                      <p className="text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        Helps us route you to the right engagement and suggest a
                        realistic approach.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    <FormSelect
                      label="Project type"
                      value={formData.projectType}
                      onValueChange={(v) => setField("projectType", v)}
                      error={errors.projectType}
                      required
                    >
                      <SelectTrigger className="h-10 w-full md:h-11">
                        <SelectValue placeholder="Choose the closest match" />
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
                      placeholder="Fintech, SaaS, healthcare…"
                      className="h-10 md:h-11"
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Company size (optional)"
                        name="companySize"
                        value={formData.companySize}
                        onChange={(e) => setField("companySize", e.target.value)}
                        placeholder="e.g. 1–10, 50–200, enterprise"
                        className="h-10 md:h-11 md:max-w-md"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-5 md:p-6">
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="bullseye" size="sm" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Goals &amp; outcomes
                      </h3>
                      <p className="text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        What problem are you solving, and what would make this
                        initiative a win?
                      </p>
                    </div>
                  </div>
                  <FormTextarea
                    label="What are you trying to achieve?"
                    name="goals"
                    value={formData.goals}
                    onChange={(e) => setField("goals", e.target.value)}
                    rows={6}
                    placeholder="Example: Replace a legacy portal so reps spend less time on admin; launch an MVP for investors by Q3; reduce support tickets by 30%…"
                    required
                    error={errors.goals}
                    className="min-h-[132px] resize-y"
                  />
                </section>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-surface-muted/30 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
              <div className="border-b border-border/80 bg-surface-muted/50 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <Text className="text-base font-semibold tracking-tight sm:text-lg">
                      Budget &amp; timeline
                    </Text>
                    <Text size="sm" color="muted" className="max-w-xl leading-relaxed">
                      Ranges and rough dates are fine—they help us shape a proposal
                      that matches reality, not guesswork.
                    </Text>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
                    <AppIcon name="chart-line" size="sm" className="!text-xs text-primary" />
                    Estimates OK
                  </span>
                </div>
              </div>

              <div className="space-y-8 p-4 sm:p-6">
                <section className="rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-5 md:p-6">
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="chart-line" size="sm" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Investment &amp; schedule
                      </h3>
                      <p className="text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        Pick the bracket that&apos;s closest. We&apos;ll refine scope and
                        pricing after we understand more.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                    <div>
                      <Label className="mb-2 block text-foreground">
                        Budget range
                      </Label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                            className="h-auto min-h-11 justify-between py-2.5 text-left sm:min-h-12"
                            onClick={() =>
                              setField("budgetRange", option.value as BudgetRange)
                            }
                            aria-pressed={formData.budgetRange === option.value}
                          >
                            <span className="text-sm font-medium leading-snug">
                              {option.label}
                            </span>
                            {formData.budgetRange === option.value ? (
                              <AppIcon name="circle-check" size="sm" />
                            ) : (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-foreground/15" />
                            )}
                          </Button>
                        ))}
                      </div>
                      {errors.budgetRange && (
                        <p className="mt-2 text-sm text-destructive">
                          {errors.budgetRange}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4 border-t border-border/60 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                      <FormInput
                        label="Desired start date"
                        name="startDate"
                        type="text"
                        value={formData.startDate}
                        onChange={(e) => setField("startDate", e.target.value)}
                        placeholder="e.g. Next month, Q3, or a specific date"
                        className="h-10 md:h-11"
                      />
                      <FormInput
                        label="Ideal launch window"
                        name="launchWindow"
                        type="text"
                        value={formData.launchWindow}
                        onChange={(e) => setField("launchWindow", e.target.value)}
                        placeholder="e.g. Before a campaign, within 6 months"
                        error={errors.launchWindow}
                        className="h-10 md:h-11"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-5 md:p-6">
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="bolt" size="sm" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        How urgent is this?
                      </h3>
                      <p className="text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        Helps us prioritize resourcing and suggest a sensible rollout
                        plan.
                      </p>
                    </div>
                  </div>
                  <Label className="sr-only">Project urgency</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                        className="h-auto min-h-11 justify-between py-2.5 text-left sm:min-h-12"
                        onClick={() => setField("urgency", option.value)}
                        aria-pressed={formData.urgency === option.value}
                      >
                        <span className="text-sm font-medium leading-snug">
                          {option.label}
                        </span>
                        {formData.urgency === option.value ? (
                          <AppIcon name="circle-check" size="sm" />
                        ) : (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-foreground/15" />
                        )}
                      </Button>
                    ))}
                  </div>
                  {errors.urgency && (
                    <p className="mt-2 text-sm text-destructive">
                      {errors.urgency}
                    </p>
                  )}
                </section>
              </div>
            </div>
          </div>
        );
      case 2:
      default:
        return (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-surface-muted/30 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
              <div className="border-b border-border/80 bg-surface-muted/50 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <Text className="text-base font-semibold tracking-tight sm:text-lg">
                      Details & contact
                    </Text>
                    <Text size="sm" color="muted" className="max-w-xl leading-relaxed">
                      Final step: capture the scope we should prioritize and how to
                      reach you. Everything here stays confidential.
                    </Text>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
                    <AppIcon name="lock" size="sm" className="!text-xs text-primary" />
                    Encrypted in transit
                  </span>
                </div>
              </div>

              <div className="space-y-8 p-4 sm:p-6">
                {/* Product scope */}
                <section className="rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-5 md:p-6">
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="layers" size="sm" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Product scope
                      </h3>
                      <p className="text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        Bullet points are fine. Focus on must-haves and any technical
                        constraints.
                      </p>
                    </div>
                  </div>

                  <FormTextarea
                    label="Key features & requirements"
                    name="features"
                    value={formData.features}
                    onChange={(e) => setField("features", e.target.value)}
                    rows={6}
                    placeholder="Example: User auth (SSO), admin dashboard, Stripe billing, export to PDF, mobile-responsive…"
                    required
                    error={errors.features}
                    className="min-h-[140px] resize-y"
                  />

                  <div className="mt-6 grid gap-5 border-t border-border/60 pt-6 md:grid-cols-2 md:gap-6">
                    <FormInput
                      label="Integrations & systems (optional)"
                      name="integrations"
                      value={formData.integrations}
                      onChange={(e) => setField("integrations", e.target.value)}
                      placeholder="Stripe, HubSpot, Salesforce, internal APIs…"
                    />
                    <FormInput
                      label="Success metrics (optional)"
                      name="successCriteria"
                      value={formData.successCriteria}
                      onChange={(e) => setField("successCriteria", e.target.value)}
                      placeholder="e.g. time saved per week, conversion uplift, SLAs"
                    />
                  </div>
                </section>

                {/* Contact */}
                <section className="rounded-xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-5 md:p-6">
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <AppIcon name="envelope" size="sm" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Your contact details
                      </h3>
                      <p className="text-xs leading-relaxed text-foreground-muted sm:text-sm">
                        We only use this to follow up on your requirements—no newsletter
                        unless you ask.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
                    <FormInput
                      label="Full name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="Jane Doe"
                      autoComplete="name"
                      required
                      error={errors.name}
                      className="h-10 md:h-11"
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
                      className="h-10 md:h-11"
                    />
                    <FormInput
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => setField("company", e.target.value)}
                      placeholder="Company or team name"
                      autoComplete="organization"
                      className="h-10 md:h-11"
                    />
                    <FormInput
                      label="Website (optional)"
                      name="website"
                      value={formData.website}
                      onChange={(e) => setField("website", e.target.value)}
                      placeholder="https://example.com"
                      autoComplete="url"
                      className="h-10 md:h-11"
                    />
                  </div>
                </section>
              </div>
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
            <div className="mt-6 rounded-2xl border border-border bg-surface-muted/80 p-4 sm:p-5">
              <p className="text-sm font-semibold text-foreground">
                What happens next
              </p>
              <div className="mt-4 space-y-3 text-sm text-foreground-muted">
                {[
                  "We reply in 1–2 business days.",
                  "We’ll highlight trade-offs and realistic next steps.",
                  "No obligation—this is for clarity first.",
                ].map((line) => (
                  <div key={line} className="flex gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <AppIcon name="circle-check" size="sm" className="!text-[10px]" />
                    </span>
                    <p className="leading-relaxed">{line}</p>
                  </div>
                ))}
              </div>
              <p className="pt-4 text-xs text-foreground-muted">
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
            <div
              className={
                currentStep === steps.length - 1
                  ? "mt-8 rounded-2xl border border-border/80 bg-surface-muted/40 p-4 shadow-sm sm:p-5"
                  : "mt-8"
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
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
                    <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[200px]">
                      {isSubmitting ? "Sending…" : "Submit requirements"}
                    </Button>
                  )}
                </div>
                <Text size="sm" color="muted" className="max-w-md leading-relaxed">
                  {currentStep === steps.length - 1
                    ? "By submitting, you agree we may email you about this request. No spam."
                    : "We’ll only use your details to follow up on this request."}
                </Text>
              </div>
            </div>
          )}
        </form>
      </ContactLayout>
    </main>
  );
}

