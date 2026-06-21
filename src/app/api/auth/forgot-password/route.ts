import { NextRequest, NextResponse } from "next/server";
import { jsx } from "react/jsx-runtime";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/auth/passwordReset";
import { writeAuditLog } from "@/lib/auth/audit";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { apiError, logApiError } from "@/lib/apiResponses";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit";
import { getResendFromAddress, isResendConfigured, sendResendReactEmail } from "@/lib/resend";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const GENERIC_SUCCESS = {
  success: true,
  message: "If an account exists for that email, a reset link has been sent.",
};

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await checkRateLimit({
      request,
      routeKey: "auth-forgot-password",
      config: { limit: 3, windowSeconds: 900 },
    });
    if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit.retryAfterSeconds);

    let data: unknown;
    try {
      data = await request.json();
    } catch {
      return apiError(400, "Validation failed", {
        fieldErrors: { body: ["Request body must be valid JSON"] },
      });
    }

    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) {
      return apiError(400, "Validation failed", {
        fieldErrors: formatZodFieldErrors(parsed.error),
      });
    }

    const { email } = parsed.data;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (user && user.isActive) {
      try {
        const { rawToken } = await createPasswordResetToken(email);
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        const resetUrl = `${siteUrl}/admin/reset-password?token=${rawToken}`;

        if (isResendConfigured()) {
          const from = getResendFromAddress();
          if (!from) {
            console.warn("[forgot-password] RESEND_FROM_EMAIL missing; skipping email");
          } else {
            await sendResendReactEmail({
              from,
              to: email,
              subject: "Reset your admin password",
              react: jsx(PasswordResetEmail, { resetUrl }),
            }).catch((err) => logApiError("/api/auth/forgot-password/email", err));
          }
        } else if (process.env.NODE_ENV !== "production") {
          console.warn("[forgot-password] Resend not configured; reset URL:", resetUrl);
        }

        await writeAuditLog({
          action: "password_reset_requested",
          userId: user.id,
          email,
          ip,
          userAgent,
        });
      } catch (err) {
        logApiError("/api/auth/forgot-password", err);
      }
    }

    return NextResponse.json(GENERIC_SUCCESS, { status: 200 });
  } catch (error) {
    logApiError("/api/auth/forgot-password", error);
    return NextResponse.json(GENERIC_SUCCESS, { status: 200 });
  }
}
