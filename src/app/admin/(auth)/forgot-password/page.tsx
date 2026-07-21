"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, MailCheck } from "lucide-react";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";

function ForgotPasswordForm() {
  const prefersReducedMotion = useReducedMotion();
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

  const cardMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
      };

  if (submitted) {
    return (
      <motion.div
        {...cardMotion}
        className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]"
      >
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Check your email
        </h1>
        <Text size="sm" color="muted" className="mb-6">
          If an account exists for that email, a reset link has been sent. Check
          your inbox and follow the instructions.
        </Text>

        <Alert variant="success" className="mb-6">
          <MailCheck aria-hidden="true" />
          <AlertDescription>
            Reset link sent. The link expires in 60 minutes.
          </AlertDescription>
        </Alert>

        <Link
          href="/admin/login"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...cardMotion}
      className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]"
    >
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
        Reset your password
      </h1>
      <Text size="sm" color="muted" className="mb-6">
        Enter your admin email address and we&apos;ll send you a reset link.
      </Text>

      <div aria-live="polite" role="alert">
        {formError && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formError) setFormError(null);
          }}
          disabled={isSubmitting}
          required
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <div className="mt-4">
        <Link
          href="/admin/login"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)] text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
