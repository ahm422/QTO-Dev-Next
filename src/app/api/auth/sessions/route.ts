import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import {
  listActiveSessionsForUser,
  getCurrentSessionId,
  revokeAllSessionsExcept,
} from "@/lib/auth/tokens";
import { parseUserAgent } from "@/lib/auth/parseUserAgent";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { apiError, logApiError } from "@/lib/apiResponses";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    if (!accessToken) return apiError(401, "Unauthorized");

    const payload = await verifyAccessToken(accessToken);
    if (!payload) return apiError(401, "Unauthorized");

    const rawRt = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    const currentSessionId = rawRt ? await getCurrentSessionId(rawRt) : null;

    const sessions = await listActiveSessionsForUser(payload.sub);

    const data = sessions.map((s) => ({
      id: s.id,
      deviceLabel: parseUserAgent(s.userAgent),
      ip: s.ip ?? "Unknown",
      createdAt: s.createdAt,
      lastUsedAt: s.lastUsedAt,
      isCurrent: s.id === currentSessionId,
    }));

    // Sort: current session first, then by lastUsedAt desc
    data.sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    });

    return NextResponse.json({ success: true, sessions: data });
  } catch (error) {
    logApiError("/api/auth/sessions GET", error);
    return apiError(500, "Internal server error");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    if (!accessToken) return apiError(401, "Unauthorized");

    const payload = await verifyAccessToken(accessToken);
    if (!payload) return apiError(401, "Unauthorized");

    const rawRt = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    if (!rawRt) return apiError(401, "Cannot determine current session");

    const revokedCount = await revokeAllSessionsExcept(payload.sub, rawRt);

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    await writeAuditLog({
      userId: payload.sub,
      email: payload.email,
      action: AUDIT_ACTIONS.SESSIONS_REVOKED_OTHERS,
      ip,
      userAgent,
      metadata: { revokedCount },
    });

    return NextResponse.json({ success: true, revokedCount });
  } catch (error) {
    logApiError("/api/auth/sessions DELETE", error);
    return apiError(500, "Internal server error");
  }
}
