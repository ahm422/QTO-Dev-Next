"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
          Password updated
        </h1>
        <Text size="sm" color="muted" className="text-center">
          Your password has been changed. Redirecting you to sign in…
        </Text>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
        Set a new password
      </h1>
      <Text size="sm" color="muted" className="mb-6 text-center">
        Choose a strong password for your admin account.
      </Text>

      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <FormInput
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
