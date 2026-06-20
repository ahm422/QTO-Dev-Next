import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { createRefreshToken } from "@/lib/auth/tokens";
import { setAuthCookies } from "@/lib/auth/cookies";
import { writeAuditLog } from "@/lib/auth/audit";
import { DUMMY_BCRYPT_HASH } from "@/lib/auth/dummyHash";
import { MAX_FAILED_LOGINS, LOCKOUT_DURATION_MS } from "@/lib/auth/constants";
import { loginSchema } from "@/lib/validators/auth";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { apiError, logApiError } from "@/lib/apiResponses";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip: string = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const rateLimit = await checkRateLimit({
      request,
      routeKey: "auth-login",
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

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return apiError(400, "Validation failed", {
        fieldErrors: formatZodFieldErrors(parsed.error),
      });
    }

    const { email, password } = parsed.data;

    const user = await prisma.adminUser.findUnique({ where: { email } });

    // Always run bcrypt compare — timing-safe path regardless of user existence
    const passwordHash = user?.passwordHash ?? DUMMY_BCRYPT_HASH;
    const passwordValid = await verifyPassword(password, passwordHash);

    if (!user || !passwordValid || !user.isActive) {
      if (user && user.isActive) {
        const newCount = user.failedLoginCount + 1;
        const lockedUntil =
          newCount >= MAX_FAILED_LOGINS
            ? new Date(Date.now() + LOCKOUT_DURATION_MS)
            : null;

        await prisma.adminUser.update({
          where: { id: user.id },
          data: { failedLoginCount: newCount, ...(lockedUntil ? { lockedUntil } : {}) },
        });
      }

      await writeAuditLog({ action: "login_failed", email, ip, userAgent });
      return apiError(401, "Invalid email or password.");
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await writeAuditLog({ action: "login_failed", email, ip, userAgent, metadata: { reason: "account_locked" } });
      return apiError(401, "Account temporarily locked. Try again later.");
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    const accessToken = await signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const { rawToken: refreshToken } = await createRefreshToken(user.id, ip, userAgent ?? undefined);

    const response = NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, role: user.role } },
      { status: 200 }
    );
    setAuthCookies(response, { accessToken, refreshToken });

    await writeAuditLog({ action: "login_success", userId: user.id, email: user.email, ip, userAgent });

    return response;
  } catch (error) {
    logApiError("/api/auth/login", error);
    return apiError(500, "Internal server error");
  }
}
