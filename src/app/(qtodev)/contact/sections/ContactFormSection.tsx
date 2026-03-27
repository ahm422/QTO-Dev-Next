"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { FormInput } from "@/components/ui/input";
import { FormTextarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { contactSubmissionSchema } from "@/lib/validators/contact";
import { formatZodFieldErrors } from "@/lib/validators/http";
import {
  firstContactFieldError,
  postContactSubmission,
} from "@/lib/contactApiClient";

export function ContactFormSection() {
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
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
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
    <section className="py-16">
      <Container size="sm">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Send us a Message</h2>

          {submitted ? (
            <Alert variant="success" className="p-6 text-center">
              <AlertDescription className="text-success font-semibold m-0">
                Thank you for reaching out! We&apos;ll get back to you soon.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError ? (
                <Alert variant="destructive" className="p-4">
                  <AlertDescription className="m-0">{formError}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  error={fieldErrors.name}
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  error={fieldErrors.email}
                />
              </div>

              <FormInput
                label="Subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
                error={fieldErrors.subject}
              />

              <FormTextarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your project..."
                rows={6}
                required
                error={fieldErrors.message}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto sm:px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
