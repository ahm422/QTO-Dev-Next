import { Suspense } from "react";
import Link from "next/link";
import { validatePasswordResetToken } from "@/lib/auth/passwordReset";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

async function ResetPasswordContent({ token }: { token: string | undefined }) {
  if (!token) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
          Invalid reset link
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          This reset link is missing or malformed.
        </p>
        <Link
          href="/admin/forgot-password"
          className="block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  const { valid } = await validatePasswordResetToken(token);

  if (!valid) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
          Link expired or already used
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          This reset link is invalid, has expired, or has already been used.
          Reset links are valid for 60 minutes.
        </p>
        <Link
          href="/admin/forgot-password"
          className="block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ResetPasswordContent token={token} />
    </Suspense>
  );
}
