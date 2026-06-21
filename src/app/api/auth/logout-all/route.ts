import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { revokeAllUserTokens } from "@/lib/auth/tokens";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/constants";
import { apiError, logApiError } from "@/lib/apiResponses";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    if (!accessToken) return apiError(401, "Unauthorized");

    const payload = await verifyAccessToken(accessToken);
    if (!payload) return apiError(401, "Unauthorized");

    await revokeAllUserTokens(payload.sub);

    const response = NextResponse.json({ success: true, ok: true }, { status: 200 });
    clearAuthCookies(response);

    await writeAuditLog({
      action: AUDIT_ACTIONS.LOGOUT_ALL,
      userId: payload.sub,
      ip,
      userAgent,
    });

    return response;
  } catch (error) {
    logApiError("/api/auth/logout-all", error);
    return apiError(500, "Internal server error");
  }
}
