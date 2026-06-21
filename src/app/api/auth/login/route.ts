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
import {
  getClientIp,
  checkLoginIpRateLimit,
  checkAuthGlobalRateLimit,
  isIpBlockedForBruteForce,
  recordFailedLoginAttempt,
  accountLockedResponse,
  rateLimitExceededResponse,
} from "@/lib/auth/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    // Layer 4 — IP blocked for cross-account brute force?
    const bruteBlock = await isIpBlockedForBruteForce(ip);
    if (bruteBlock.blocked) return rateLimitExceededResponse(bruteBlock.retryAfterSeconds ?? 3600);

    // Layer 3 — global auth rate limit (100 req / 15 min)
    const globalLimit = await checkAuthGlobalRateLimit(request);
    if (!globalLimit.allowed) return rateLimitExceededResponse(globalLimit.retryAfterSeconds);

    // Layer 1 — login IP rate limit (5 req / 60 s sliding window)
    const loginLimit = await checkLoginIpRateLimit(request);
    if (!loginLimit.allowed) return rateLimitExceededResponse(loginLimit.retryAfterSeconds);

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

    // Layer 2 — account lockout check (before bcrypt; don't increment while locked)
    if (user?.lockedUntil && user.lockedUntil > new Date()) {
      const secondsRemaining = (user.lockedUntil.getTime() - Date.now()) / 1000;
      await writeAuditLog({ action: "login_failed", email, ip, userAgent, metadata: { reason: "account_locked" } });
      return accountLockedResponse(secondsRemaining);
    }

    // Always run bcrypt — timing-safe path regardless of user existence
    const passwordHash = user?.passwordHash ?? DUMMY_BCRYPT_HASH;
    const passwordValid = await verifyPassword(password, passwordHash);

    if (!user || !passwordValid || !user.isActive) {
      if (user?.isActive) {
        const newCount = user.failedLoginCount + 1;
        if (newCount >= MAX_FAILED_LOGINS) {
          const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
          await prisma.adminUser.update({
            where: { id: user.id },
            data: { failedLoginCount: newCount, lockedUntil },
          });
          await writeAuditLog({
            action: "account_locked",
            userId: user.id,
            email,
            ip,
            userAgent,
            metadata: { failedLoginCount: newCount, lockedUntil },
          });
        } else {
          await prisma.adminUser.update({
            where: { id: user.id },
            data: { failedLoginCount: newCount },
          });
        }
      }

      // Records login_failed audit + increments Layer 4 brute-force counter
      await recordFailedLoginAttempt(ip, { email, userAgent });
      return apiError(401, "Invalid email or password.");
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
