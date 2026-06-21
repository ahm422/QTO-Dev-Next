import { NextRequest, NextResponse } from "next/server";
import { consumePasswordResetToken } from "@/lib/auth/passwordReset";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { apiError, logApiError } from "@/lib/apiResponses";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const rateLimit = await checkRateLimit({
      request,
      routeKey: "auth-reset-password",
      config: { limit: 5, windowSeconds: 60 },
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

    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) {
      return apiError(400, "Validation failed", {
        fieldErrors: formatZodFieldErrors(parsed.error),
      });
    }

    const { token, password } = parsed.data;

    const result = await consumePasswordResetToken(token, password);
    if (!result.success) {
      return apiError(400, "Invalid or expired reset token.");
    }

    await writeAuditLog({
      action: AUDIT_ACTIONS.PASSWORD_RESET_COMPLETED,
      userId: result.userId ?? null,
      ip,
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: "Password updated. Please sign in." },
      { status: 200 }
    );
  } catch (error) {
    logApiError("/api/auth/reset-password", error);
    return apiError(500, "Internal server error");
  }
}
