"use client";

import { useState } from "react";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { contactSubmissionSchema } from "@/lib/validators/contact";
import { formatZodFieldErrors } from "@/lib/validators/http";
import {
  firstContactFieldError,
  postContactSubmission,
} from "@/lib/contactApiClient";
import { cn } from "@/components/theme/cn";

export interface ContactUsFormProps {
  /** Submission source tag stored with the contact record */
  source: string;
  /** Compact layout for the floating popup */
  compact?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function ContactUsForm({
  source,
  compact = false,
  className,
  onSuccess,
}: ContactUsFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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
      source,
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
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        onSuccess?.();
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

  if (submitted) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/90 to-success/5 shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
          className
        )}
      >
        <div
          className={cn(
            "border-b border-border/80 bg-success/10",
            compact ? "px-4 py-3" : "px-4 py-4 sm:px-6 sm:py-5"
          )}
        >
          <Text
            className={cn(
              "font-semibold tracking-tight text-foreground",
              compact ? "text-sm" : "text-base sm:text-lg"
            )}
          >
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
        <div className={cn(compact ? "p-4" : "p-5 sm:p-6")}>
          <div
            className={cn(
              "flex gap-3",
              compact
                ? "flex-col items-start"
                : "flex-col gap-4 sm:flex-row sm:items-start"
            )}
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
              <AppIcon name="circle-check" size="base" />
            </span>
            <div className="space-y-3">
              <Text
                size={compact ? "base" : "lg"}
                className="font-semibold text-success"
              >
                Thank you.
              </Text>
              {!compact ? (
                <Text color="muted" className="leading-relaxed">
                  If you have more details to add, you can send another message.
                </Text>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                size={compact ? "sm" : "lg"}
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(compact ? "space-y-4" : "space-y-6", className)}
      aria-label="Contact form"
    >
      {formError ? (
        <Alert variant="destructive" className={compact ? "p-3" : "p-4"}>
          <AlertDescription className="m-0">{formError}</AlertDescription>
        </Alert>
      ) : null}

      <div
        className={cn(
          "grid gap-4",
          !compact && "gap-5 md:grid-cols-2 md:gap-6"
        )}
      >
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
        rows={compact ? 4 : 6}
        required
        floatingLabel
        error={fieldErrors.message}
        className={cn("resize-y", compact ? "min-h-[96px]" : "min-h-[140px]")}
      />

      <div
        className={cn(
          "flex flex-col gap-2 pt-1",
          compact
            ? "items-stretch"
            : "items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <Button
          type="submit"
          size={compact ? "default" : "lg"}
          className={compact ? "w-full" : "min-w-[200px]"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
        {!compact ? (
          <Text size="sm" color="muted" className="leading-relaxed">
            We’ll only use your details to reply to this message.
          </Text>
        ) : null}
      </div>
    </form>
  );
}
