import { Suspense } from "react";
import Link from "next/link";
import { AlertTriangle, Clock, Loader2 } from "lucide-react";
import { validatePasswordResetToken } from "@/lib/auth/passwordReset";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

async function ResetPasswordContent({ token }: { token: string | undefined }) {
  if (!token) {
    return (
      <div className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Invalid reset link
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This reset link is missing or malformed.
        </p>
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle aria-hidden="true" />
          <AlertDescription>
            We couldn&apos;t read a reset token from this link.
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full">
          <Link href="/admin/forgot-password">Request a new reset link</Link>
        </Button>
      </div>
    );
  }

  const { valid } = await validatePasswordResetToken(token);

  if (!valid) {
    return (
      <div className="rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)]">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          Link expired or already used
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This reset link is invalid, has expired, or has already been used.
          Reset links are valid for 60 minutes.
        </p>
        <Alert variant="destructive" className="mb-6">
          <Clock aria-hidden="true" />
          <AlertDescription>
            For your security, request a fresh link to continue.
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full">
          <Link href="/admin/forgot-password">Request a new reset link</Link>
        </Button>
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
        <div className="flex items-center justify-center rounded-[var(--admin-radius)] border border-border bg-card p-8 shadow-[var(--admin-shadow-md)] text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
      }
    >
      <ResetPasswordContent token={token} />
    </Suspense>
  );
}
