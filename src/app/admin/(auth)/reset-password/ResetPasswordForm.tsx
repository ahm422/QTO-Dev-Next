"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";
import { PasswordField } from "../_components/PasswordField";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/admin/login"), 2000);
    return () => clearTimeout(timer);
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
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
        const passwordError = body?.details?.fieldErrors?.password?.[0];
        setFormError(passwordError ?? body?.error ?? "Invalid or expired reset link.");
        return;
      }

      setSuccess(true);
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

  if (success) {
    return (
      <motion.div
        {...cardMotion}
        className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]"
      >
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Password updated
        </h1>
        <Text size="sm" color="muted" className="mb-6">
          Your password has been changed successfully.
        </Text>

        <Alert variant="success" className="mb-6">
          <CheckCircle aria-hidden="true" />
          <AlertDescription>
            You can now sign in with your new password.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span aria-live="polite">Redirecting you to sign in…</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...cardMotion}
      className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]"
    >
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
        Set a new password
      </h1>
      <Text size="sm" color="muted" className="mb-6">
        Choose a strong password for your admin account.
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
        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (formError) setFormError(null);
          }}
          disabled={isSubmitting}
          required
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (formError) setFormError(null);
          }}
          disabled={isSubmitting}
          required
        />

        <div className="rounded-md bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Password requirements</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>At least 12 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one digit</li>
            <li>At least one special character</li>
          </ul>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
