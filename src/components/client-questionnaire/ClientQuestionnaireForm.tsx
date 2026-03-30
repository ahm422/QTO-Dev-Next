"use client";

import { useState } from "react";
import Link from "next/link";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/shared/Text";
import { FormStepper } from "@/components/contact/FormStepper";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BRANDING_CHOICES,
  PAGE_CHOICES,
  QUESTIONNAIRE_STEPS,
  SERVICE_CHOICES,
  type BrandingValue,
  type PageValue,
  type ServiceValue,
} from "@/components/client-questionnaire/constants";
import { requirementSubmissionSchema } from "@/lib/validators/requirement";
import {
  QTODEV_CLIENT_QUESTIONNAIRE_INTENT,
} from "@/lib/validators/clientQuestionnaire";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { postRequirementSubmission } from "@/lib/requirementApiClient";
import { cn } from "@/components/theme/cn";

type YesNo = "" | "yes" | "no";

interface BasicFields {
  name: string;
  email: string;
  phone: string;
  company: string;
  companyLocation: string;
  role: string;
}

interface QuestionnaireFields {
  servicesInterested: ServiceValue[];
  servicesOtherSpecify: string;
  existingWebsite: YesNo;
  existingWebsiteLink: string;
  hasDomainHosting: YesNo;
  pagesWanted: PageValue[];
  pagesOther: string;
  contentReady: "" | "yes" | "no" | "need-help";
  referenceWebsites: string;
  hasLogo: YesNo;
  logoRedesign: "yes" | "no" | undefined;
  logoStylePreferred: string;
  brandColours: string;
  brandingMaterials: BrandingValue[];
  companyDescription: string;
  tradesScopes: string;
  projectKinds: string;
  differentiators: string;
  attachmentFileNames: string[];
  platformApproachAcknowledged: boolean;
}

const initialBasic: BasicFields = {
  name: "",
  email: "",
  phone: "",
  company: "",
  companyLocation: "",
  role: "",
};

const initialQ: QuestionnaireFields = {
  servicesInterested: [],
  servicesOtherSpecify: "",
  existingWebsite: "",
  existingWebsiteLink: "",
  hasDomainHosting: "",
  pagesWanted: [],
  pagesOther: "",
  contentReady: "",
  referenceWebsites: "",
  hasLogo: "",
  logoRedesign: undefined,
  logoStylePreferred: "",
  brandColours: "",
  brandingMaterials: [],
  companyDescription: "",
  tradesScopes: "",
  projectKinds: "",
  differentiators: "",
  attachmentFileNames: [],
  platformApproachAcknowledged: false,
};

type FieldErrors = Record<string, string>;

function mergeZodFieldMap(
  raw: Record<string, string[]>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, list] of Object.entries(raw)) {
    const msg = list[0];
    if (msg?.trim()) out[k] = msg;
  }
  return out;
}

function qErr(errors: FieldErrors, leaf: string): string | undefined {
  return (
    errors[`questionnaire.${leaf}`] ?? errors[leaf] ?? errors[`${leaf}`]
  );
}

function buildPayload(basic: BasicFields, q: QuestionnaireFields) {
  const questionnaire = {
    servicesInterested: q.servicesInterested,
    servicesOtherSpecify: q.servicesOtherSpecify || undefined,
    existingWebsite: q.existingWebsite as "yes" | "no",
    existingWebsiteLink: q.existingWebsiteLink || undefined,
    hasDomainHosting: q.hasDomainHosting as "yes" | "no",
    pagesWanted: q.pagesWanted,
    pagesOther: q.pagesOther || undefined,
    contentReady: q.contentReady as "yes" | "no" | "need-help",
    referenceWebsites: q.referenceWebsites || undefined,
    hasLogo: q.hasLogo as "yes" | "no",
    logoRedesign: q.logoRedesign,
    logoStylePreferred: q.logoStylePreferred || undefined,
    brandColours: q.brandColours || undefined,
    brandingMaterials: q.brandingMaterials,
    companyDescription: q.companyDescription || undefined,
    tradesScopes: q.tradesScopes || undefined,
    projectKinds: q.projectKinds || undefined,
    differentiators: q.differentiators || undefined,
    attachmentFileNames:
      q.attachmentFileNames.length > 0 ? q.attachmentFileNames : undefined,
    platformApproachAcknowledged: q.platformApproachAcknowledged || undefined,
  };

  const website =
    q.existingWebsite === "yes" && q.existingWebsiteLink.trim()
      ? q.existingWebsiteLink.trim()
      : undefined;

  const desc = q.companyDescription.trim();
  const message = desc
    ? `QTODEV client questionnaire: ${desc.slice(0, 500)}${desc.length > 500 ? "…" : ""}`
    : "QTODEV client questionnaire submission.";

  return {
    intent: QTODEV_CLIENT_QUESTIONNAIRE_INTENT,
    source: "client-questionnaire",
    name: basic.name.trim(),
    email: basic.email.trim(),
    phone: basic.phone.trim(),
    company: basic.company.trim() || undefined,
    companyLocation: basic.companyLocation.trim() || undefined,
    role: basic.role.trim() || undefined,
    website,
    message,
    questionnaire,
  };
}

function YesNoToggle({
  label,
  value,
  onChange,
  error,
  required: isReq,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground mb-2">
        {label}
        {isReq ? <span className="text-destructive"> *</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { v: "yes" as const, lbl: "Yes" },
            { v: "no" as const, lbl: "No" },
          ] as const
        ).map(({ v, lbl }) => (
          <Button
            key={v}
            type="button"
            variant={value === v ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
          >
            {lbl}
          </Button>
        ))}
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function ClientQuestionnaireForm() {
  const [step, setStep] = useState(0);
  const [basic, setBasic] = useState<BasicFields>(initialBasic);
  const [q, setQ] = useState<QuestionnaireFields>(initialQ);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [stepErrors, setStepErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const clearFieldError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next[`questionnaire.${key}`];
      return next;
    });
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormError(null);
  };

  const setBasicField = (key: keyof BasicFields, value: string) => {
    setBasic((prev) => ({ ...prev, [key]: value }));
    clearFieldError(key);
  };

  const validateStepLocal = (i: number): boolean => {
    const next: FieldErrors = {};
    if (i === 0) {
      if (!basic.name.trim()) next.name = "Full name is required.";
      if (!basic.email.trim()) next.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basic.email))
        next.email = "Enter a valid email address.";
      if (!basic.phone.trim()) next.phone = "Phone number is required.";
    } else if (i === 1) {
      if (q.servicesInterested.length === 0)
        next["questionnaire.servicesInterested"] =
          "Select at least one service.";
      if (
        q.servicesInterested.includes("other") &&
        !q.servicesOtherSpecify.trim()
      )
        next["questionnaire.servicesOtherSpecify"] =
          "Please specify other services.";
    } else if (i === 2) {
      if (!q.existingWebsite)
        next["questionnaire.existingWebsite"] = "Please answer this question.";
      if (q.existingWebsite === "yes" && !q.existingWebsiteLink.trim())
        next["questionnaire.existingWebsiteLink"] =
          "Please share a link to your site.";
      if (!q.hasDomainHosting)
        next["questionnaire.hasDomainHosting"] =
          "Please answer this question.";
      if (q.pagesWanted.length === 0)
        next["questionnaire.pagesWanted"] = "Select at least one page.";
      if (q.pagesWanted.includes("other") && !q.pagesOther.trim())
        next["questionnaire.pagesOther"] = "Describe the other pages.";
      if (!q.contentReady)
        next["questionnaire.contentReady"] = "Select a content option.";
    } else if (i === 3) {
      if (!q.hasLogo)
        next["questionnaire.hasLogo"] = "Please answer this question.";
      if (q.hasLogo === "yes" && q.logoRedesign === undefined)
        next["questionnaire.logoRedesign"] = "Please choose Yes or No.";
    } else if (i === 4) {
      if (!q.companyDescription.trim())
        next["questionnaire.companyDescription"] =
          "Briefly describe your company.";
    }

    setStepErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStepLocal(step)) return;
    setStep((s) => Math.min(s + 1, QUESTIONNAIRE_STEPS.length - 1));
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setStepErrors({});
  };

  const toggleService = (v: ServiceValue) => {
    setQ((prev) => {
      const has = prev.servicesInterested.includes(v);
      const servicesInterested = has
        ? prev.servicesInterested.filter((x) => x !== v)
        : [...prev.servicesInterested, v];
      return { ...prev, servicesInterested };
    });
    clearFieldError("questionnaire.servicesInterested");
    clearFieldError("servicesInterested");
  };

  const togglePage = (v: PageValue) => {
    setQ((prev) => {
      const has = prev.pagesWanted.includes(v);
      const pagesWanted = has
        ? prev.pagesWanted.filter((x) => x !== v)
        : [...prev.pagesWanted, v];
      return { ...prev, pagesWanted };
    });
    clearFieldError("questionnaire.pagesWanted");
  };

  const toggleBranding = (v: BrandingValue) => {
    setQ((prev) => {
      const has = prev.brandingMaterials.includes(v);
      const brandingMaterials = has
        ? prev.brandingMaterials.filter((x) => x !== v)
        : [...prev.brandingMaterials, v];
      return { ...prev, brandingMaterials };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateStepLocal(step)) return;

    const payload = buildPayload(basic, q);
    const parsed = requirementSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const raw = formatZodFieldErrors(parsed.error);
      setErrors(mergeZodFieldMap(raw));
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await postRequirementSubmission(
        parsed.data as unknown as Record<string, unknown>
      );
      if (result.ok) {
        setDone(true);
        setBasic(initialBasic);
        setQ(initialQ);
        setErrors({});
        return;
      }
      setFormError(result.errorMessage);
      if (result.fieldErrors) {
        setErrors((prev) => ({
          ...prev,
          ...mergeZodFieldMap(result.fieldErrors ?? {}),
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4 text-center sm:text-left">
        <Text size="lg" className="font-semibold text-success">
          Thank you for choosing QTODEV!
        </Text>
        <Text color="muted">
          We&apos;ve received your questionnaire and will get back to you soon.
        </Text>
        <Text size="sm" color="muted">
          Contact us at{" "}
          <a
            href="mailto:info@qtodev.com"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            info@qtodev.com
          </a>
        </Text>
        <Button asChild variant="secondary" className="mt-2">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const showStep = stepErrors;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <Text size="sm" color="muted">
              Tell us who you are so we can reach you.
            </Text>
            <div className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Full name"
                value={basic.name}
                onChange={(e) => setBasicField("name", e.target.value)}
                required
                error={errors.name ?? showStep.name}
              />
              <FormInput
                label="Email address"
                type="email"
                value={basic.email}
                onChange={(e) => setBasicField("email", e.target.value)}
                required
                error={errors.email ?? showStep.email}
              />
              <FormInput
                label="Phone number"
                type="tel"
                value={basic.phone}
                onChange={(e) => setBasicField("phone", e.target.value)}
                required
                error={errors.phone ?? showStep.phone}
              />
              <FormInput
                label="Company / business name"
                value={basic.company}
                onChange={(e) => setBasicField("company", e.target.value)}
                error={errors.company}
              />
              <FormInput
                label="Company / business location"
                value={basic.companyLocation}
                onChange={(e) =>
                  setBasicField("companyLocation", e.target.value)
                }
                error={errors.companyLocation}
              />
              <FormInput
                label="Your role in the company"
                value={basic.role}
                onChange={(e) => setBasicField("role", e.target.value)}
                error={errors.role}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <Text size="sm" color="muted">
              Select all services you&apos;re interested in.
            </Text>
            <div>
              <Label className="mb-2 block">Services *</Label>
              <div className="flex flex-col gap-2">
                {SERVICE_CHOICES.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      q.servicesInterested.includes(value)
                        ? "default"
                        : "outline"
                    }
                    className="h-auto min-h-10 justify-start whitespace-normal py-2 text-left font-normal"
                    onClick={() => toggleService(value)}
                    aria-pressed={q.servicesInterested.includes(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {(errors["questionnaire.servicesInterested"] ??
                showStep["questionnaire.servicesInterested"]) ? (
                <p className="mt-1 text-sm text-destructive">
                  {errors["questionnaire.servicesInterested"] ??
                    showStep["questionnaire.servicesInterested"]}
                </p>
              ) : null}
            </div>
            {q.servicesInterested.includes("other") ? (
              <FormInput
                label="Other services (specify)"
                value={q.servicesOtherSpecify}
                onChange={(e) => {
                  setQ((p) => ({
                    ...p,
                    servicesOtherSpecify: e.target.value,
                  }));
                  clearFieldError("questionnaire.servicesOtherSpecify");
                }}
                error={
                  errors["questionnaire.servicesOtherSpecify"] ??
                  showStep["questionnaire.servicesOtherSpecify"]
                }
              />
            ) : null}
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <YesNoToggle
              label="Do you have an existing website?"
              value={q.existingWebsite}
              onChange={(v) => {
                setQ((p) => ({ ...p, existingWebsite: v }));
                clearFieldError("questionnaire.existingWebsite");
              }}
              error={
                errors["questionnaire.existingWebsite"] ??
                showStep["questionnaire.existingWebsite"]
              }
              required
            />
            {q.existingWebsite === "yes" ? (
              <FormInput
                label="Website link"
                value={q.existingWebsiteLink}
                onChange={(e) => {
                  setQ((p) => ({ ...p, existingWebsiteLink: e.target.value }));
                  clearFieldError("questionnaire.existingWebsiteLink");
                }}
                placeholder="https://"
                error={
                  errors["questionnaire.existingWebsiteLink"] ??
                  showStep["questionnaire.existingWebsiteLink"]
                }
              />
            ) : null}
            <YesNoToggle
              label="Do you already have domain and hosting?"
              value={q.hasDomainHosting}
              onChange={(v) => {
                setQ((p) => ({ ...p, hasDomainHosting: v }));
                clearFieldError("questionnaire.hasDomainHosting");
              }}
              error={
                errors["questionnaire.hasDomainHosting"] ??
                showStep["questionnaire.hasDomainHosting"]
              }
              required
            />
            <div>
              <Label className="mb-2 block">
                Which pages do you want on the site? *
              </Label>
              <div className="flex flex-wrap gap-2">
                {PAGE_CHOICES.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      q.pagesWanted.includes(value) ? "default" : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => togglePage(value)}
                    aria-pressed={q.pagesWanted.includes(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {(errors["questionnaire.pagesWanted"] ??
                showStep["questionnaire.pagesWanted"]) ? (
                <p className="mt-1 text-sm text-destructive">
                  {errors["questionnaire.pagesWanted"] ??
                    showStep["questionnaire.pagesWanted"]}
                </p>
              ) : null}
            </div>
            {q.pagesWanted.includes("other") ? (
              <FormInput
                label="Other pages (describe)"
                value={q.pagesOther}
                onChange={(e) => {
                  setQ((p) => ({ ...p, pagesOther: e.target.value }));
                  clearFieldError("questionnaire.pagesOther");
                }}
                error={
                  errors["questionnaire.pagesOther"] ??
                  showStep["questionnaire.pagesOther"]
                }
              />
            ) : null}
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground mb-2">
                Do you have content ready (text, images, etc.)? *
              </legend>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {(
                  [
                    { v: "yes" as const, lbl: "Yes" },
                    { v: "no" as const, lbl: "No" },
                    {
                      v: "need-help" as const,
                      lbl: "Need help with content creation",
                    },
                  ] as const
                ).map(({ v, lbl }) => (
                  <Button
                    key={v}
                    type="button"
                    variant={q.contentReady === v ? "default" : "outline"}
                    className="justify-start text-left"
                    onClick={() => {
                      setQ((p) => ({ ...p, contentReady: v }));
                      clearFieldError("questionnaire.contentReady");
                    }}
                    aria-pressed={q.contentReady === v}
                  >
                    {lbl}
                  </Button>
                ))}
              </div>
              {(errors["questionnaire.contentReady"] ??
                showStep["questionnaire.contentReady"]) ? (
                <p className="text-sm text-destructive">
                  {errors["questionnaire.contentReady"] ??
                    showStep["questionnaire.contentReady"]}
                </p>
              ) : null}
            </fieldset>
            <FormTextarea
              label="Websites you like (layout or style) — optional"
              value={q.referenceWebsites}
              onChange={(e) => {
                setQ((p) => ({ ...p, referenceWebsites: e.target.value }));
                clearFieldError("questionnaire.referenceWebsites");
              }}
              rows={3}
              placeholder="Links or site names…"
              error={qErr(errors, "referenceWebsites")}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <YesNoToggle
              label="Do you currently have a logo?"
              value={q.hasLogo}
              onChange={(v) => {
                setQ((p) => ({
                  ...p,
                  hasLogo: v,
                  logoRedesign: v === "no" ? undefined : p.logoRedesign,
                }));
                clearFieldError("questionnaire.hasLogo");
                clearFieldError("questionnaire.logoRedesign");
              }}
              error={
                errors["questionnaire.hasLogo"] ??
                showStep["questionnaire.hasLogo"]
              }
              required
            />
            {q.hasLogo === "yes" ? (
              <YesNoToggle
                label="Would you like to redesign or enhance your existing logo?"
                value={
                  q.logoRedesign === undefined ? "" : q.logoRedesign
                }
                onChange={(v) => {
                  setQ((p) => ({
                    ...p,
                    logoRedesign: v === "" ? undefined : v,
                  }));
                  clearFieldError("questionnaire.logoRedesign");
                }}
                error={
                  errors["questionnaire.logoRedesign"] ??
                  showStep["questionnaire.logoRedesign"]
                }
                required
              />
            ) : null}
            <FormInput
              label="Preferred logo style (optional)"
              value={q.logoStylePreferred}
              onChange={(e) => {
                setQ((p) => ({ ...p, logoStylePreferred: e.target.value }));
                clearFieldError("questionnaire.logoStylePreferred");
              }}
              placeholder="e.g. Modern, bold, construction-themed…"
              error={qErr(errors, "logoStylePreferred")}
            />
            <FormInput
              label="Colour preferences or brand colours"
              value={q.brandColours}
              onChange={(e) => {
                setQ((p) => ({ ...p, brandColours: e.target.value }));
                clearFieldError("questionnaire.brandColours");
              }}
              error={qErr(errors, "brandColours")}
            />
            <div>
              <Label className="mb-2 block">Branding materials needed</Label>
              <div className="flex flex-wrap gap-2">
                {BRANDING_CHOICES.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      q.brandingMaterials.includes(value)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleBranding(value)}
                    aria-pressed={q.brandingMaterials.includes(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <FormTextarea
              label="Briefly describe your company and what you do"
              value={q.companyDescription}
              onChange={(e) => {
                setQ((p) => ({ ...p, companyDescription: e.target.value }));
                clearFieldError("questionnaire.companyDescription");
              }}
              rows={4}
              required
              placeholder='Example: "We specialize in commercial drywall across Texas."'
              error={
                errors["questionnaire.companyDescription"] ??
                showStep["questionnaire.companyDescription"]
              }
            />
            <FormTextarea
              label="Trades or scopes of work you cover"
              value={q.tradesScopes}
              onChange={(e) => {
                setQ((p) => ({ ...p, tradesScopes: e.target.value }));
                clearFieldError("questionnaire.tradesScopes");
              }}
              rows={3}
              placeholder="e.g. Concrete, electrical, painting…"
              error={qErr(errors, "tradesScopes")}
            />
            <FormTextarea
              label="Kinds of projects you typically work on"
              value={q.projectKinds}
              onChange={(e) => {
                setQ((p) => ({ ...p, projectKinds: e.target.value }));
                clearFieldError("questionnaire.projectKinds");
              }}
              rows={3}
              placeholder="Residential, commercial, public, industrial…"
              error={qErr(errors, "projectKinds")}
            />
            <FormTextarea
              label="What sets your company apart?"
              value={q.differentiators}
              onChange={(e) => {
                setQ((p) => ({ ...p, differentiators: e.target.value }));
                clearFieldError("questionnaire.differentiators");
              }}
              rows={3}
              error={qErr(errors, "differentiators")}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Text size="sm" color="muted">
              Upload any relevant files (logos, brochures, references). File
              names are recorded with your submission; for large assets we may
              follow up by email.
            </Text>
            <div>
              <Label htmlFor="cq-files" className="mb-2 block">
                Files (optional)
              </Label>
              <input
                id="cq-files"
                type="file"
                multiple
                className={cn(
                  "text-sm text-foreground file:mr-3 file:rounded-md file:border-0",
                  "file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                )}
                onChange={(e) => {
                  const list = e.target.files;
                  setQ((p) => ({
                    ...p,
                    attachmentFileNames: list
                      ? Array.from(list, (f) => f.name)
                      : [],
                  }));
                  clearFieldError("questionnaire.attachmentFileNames");
                }}
              />
              {q.attachmentFileNames.length > 0 ? (
                <ul className="mt-2 list-inside list-disc text-sm text-foreground-muted">
                  {q.attachmentFileNames.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        );
      case 6:
      default:
        return (
          <div className="space-y-6">
            <Text color="muted" className="leading-relaxed">
              We typically start with a WordPress-based website for ease of
              management and quick turnaround. For custom features such as a
              client portal, project tracking, or integrations, we also offer
              React and Django-based development. We&apos;ll guide you when a
              custom stack is the right fit.
            </Text>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border"
                checked={q.platformApproachAcknowledged}
                onChange={(e) =>
                  setQ((p) => ({
                    ...p,
                    platformApproachAcknowledged: e.target.checked,
                  }))
                }
              />
              <span className="text-foreground">
                I&apos;ve read the platform approach note above (optional)
              </span>
            </label>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError ? (
        <Alert variant="destructive" className="p-4">
          <AlertDescription className="m-0">{formError}</AlertDescription>
        </Alert>
      ) : null}
      <FormStepper
        steps={[...QUESTIONNAIRE_STEPS]}
        currentStepIndex={step}
      />
      {renderStep()}
      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={goBack}>
              Back
            </Button>
          ) : null}
          {step < QUESTIONNAIRE_STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Submit questionnaire"}
            </Button>
          )}
        </div>
        <Text size="sm" color="muted" className="max-w-md">
          We use your answers only to prepare a tailored proposal. See our{" "}
          <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
            privacy policy
          </Link>
          .
        </Text>
      </div>
    </form>
  );
}
