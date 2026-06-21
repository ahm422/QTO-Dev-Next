import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { revokeRefreshToken } from "@/lib/auth/tokens";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";
import { logApiError } from "@/lib/apiResponses";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const rawRefreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    if (rawRefreshToken) {
      await revokeRefreshToken(rawRefreshToken).catch((err) =>
        console.error("[logout] Failed to revoke refresh token", err)
      );
    }

    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    const payload = accessToken ? await verifyAccessToken(accessToken) : null;

    const response = NextResponse.json({ success: true, ok: true }, { status: 200 });
    clearAuthCookies(response);

    await writeAuditLog({
      action: AUDIT_ACTIONS.LOGOUT,
      userId: payload?.sub ?? null,
      email: payload?.email ?? null,
      ip,
      userAgent,
    });

    return response;
  } catch (error) {
    logApiError("/api/auth/logout", error);
    const response = NextResponse.json({ success: true, ok: true }, { status: 200 });
    clearAuthCookies(response);
    return response;
  }
}
