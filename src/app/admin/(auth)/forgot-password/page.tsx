"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.status === 429) {
        const body = await res.json().catch(() => null);
        const retryAfter = body?.details?.retryAfterSeconds;
        setFormError(
          retryAfter
            ? `Too many requests. Please try again in ${retryAfter} seconds.`
            : "Too many requests. Please try again later."
        );
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const emailError = body?.details?.fieldErrors?.email?.[0];
        setFormError(emailError ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
          Check your email
        </h1>
        <Text size="sm" color="muted" className="mb-6 text-center">
          If an account exists for that email, a reset link has been sent. Check
          your inbox and follow the instructions.
        </Text>
        <Link
          href="/admin/login"
          className="block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
        Reset your password
      </h1>
      <Text size="sm" color="muted" className="mb-6 text-center">
        Enter your admin email address and we&apos;ll send you a reset link.
      </Text>

      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href="/admin/login"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
