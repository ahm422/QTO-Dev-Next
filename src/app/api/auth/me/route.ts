import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/constants";
import { apiError, logApiError } from "@/lib/apiResponses";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
    if (!accessToken) return apiError(401, "Unauthorized");

    const payload = await verifyAccessToken(accessToken);
    if (!payload) return apiError(401, "Unauthorized");

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      const response = NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      clearAuthCookies(response);
      return response;
    }

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, role: user.role } },
      { status: 200 }
    );
  } catch (error) {
    logApiError("/api/auth/me", error);
    return apiError(500, "Internal server error");
  }
}
