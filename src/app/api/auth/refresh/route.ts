import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth/jwt";
import { verifyAndRotateRefreshToken } from "@/lib/auth/tokens";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";
import { apiError, logApiError } from "@/lib/apiResponses";
import { persistD1BookmarkOnResponse } from "@/lib/d1/session";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const rawToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    if (!rawToken) {
      const response = NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      clearAuthCookies(response);
      return response;
    }

    const rotated = await verifyAndRotateRefreshToken(rawToken);
    if (!rotated) {
      await writeAuditLog({
        action: AUDIT_ACTIONS.REFRESH_REUSE_DETECTED,
        ip,
        userAgent,
        metadata: { reason: "invalid_or_revoked" },
      });
      const response = NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      clearAuthCookies(response);
      return response;
    }

    const user = await prisma.adminUser.findUnique({ where: { id: rotated.userId } });
    if (!user || !user.isActive) {
      const response = NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      clearAuthCookies(response);
      return response;
    }

    const accessToken = await signAccessToken({ sub: user.id, role: user.role });

    const response = NextResponse.json({ success: true, ok: true }, { status: 200 });
    setAuthCookies(response, { accessToken, refreshToken: rotated.rawToken });

    if (process.env.AUDIT_LOG_TOKEN_REFRESH === "true") {
      await writeAuditLog({
        action: AUDIT_ACTIONS.TOKEN_REFRESH,
        userId: user.id,
        email: user.email,
        ip,
        userAgent,
      });
    }

    await persistD1BookmarkOnResponse(response);

    return response;
  } catch (error) {
    logApiError("/api/auth/refresh", error);
    return apiError(500, "Internal server error");
  }
}
