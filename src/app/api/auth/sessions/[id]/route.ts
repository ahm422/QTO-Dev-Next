import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import {
  revokeSessionById,
  getCurrentSessionId,
} from "@/lib/auth/tokens";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { writeAuditLog } from "@/lib/auth/audit";
import { apiError, logApiError } from "@/lib/apiResponses";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    if (!accessToken) return apiError(401, "Unauthorized");

    const payload = await verifyAccessToken(accessToken);
    if (!payload) return apiError(401, "Unauthorized");

    const { id: sessionId } = await params;

    const rawRt = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    const currentSessionId = rawRt ? await getCurrentSessionId(rawRt) : null;
    const wasCurrent = sessionId === currentSessionId;

    const revoked = await revokeSessionById(payload.sub, sessionId);
    if (!revoked) return apiError(404, "Session not found");

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    await writeAuditLog({
      userId: payload.sub,
      email: payload.email,
      action: "session_revoked",
      ip,
      userAgent,
      metadata: { sessionId, wasCurrent },
    });

    const response = NextResponse.json({ success: true, wasCurrent });

    if (wasCurrent) {
      clearAuthCookies(response);
    }

    return response;
  } catch (error) {
    logApiError("/api/auth/sessions/[id] DELETE", error);
    return apiError(500, "Internal server error");
  }
}
