"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "@/components/ui/shared/Text";
import { sanitizeAdminRedirect } from "@/lib/auth/redirect";
import { PasswordField } from "../_components/PasswordField";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const prefersReducedMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);

    const trimmedEmail = email.trim();
    let hasError = false;
    if (!trimmedEmail) {
      setEmailError("Email is required.");
      hasError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setFormError(
          typeof body?.error === "string" ? body.error : "Invalid email or password."
        );
        return;
      }

      const destination = sanitizeAdminRedirect(redirectTo);
      router.push(destination);
      router.refresh();
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

  return (
    <motion.div
      {...cardMotion}
      className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]"
    >
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
        Admin sign in
      </h1>
      <Text size="sm" color="muted" className="mb-6">
        Sign in with your admin account. Access is by invitation only.
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
            if (emailError) setEmailError(null);
          }}
          error={emailError ?? undefined}
          disabled={isSubmitting}
          required
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
          }}
          error={passwordError ?? undefined}
          disabled={isSubmitting}
          required
        />
        <div className="text-right">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[var(--admin-radius)] border border-border bg-card p-8 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
