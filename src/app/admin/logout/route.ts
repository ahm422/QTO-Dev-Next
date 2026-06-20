import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { revokeRefreshToken } from "@/lib/auth/tokens";
import { writeAuditLog } from "@/lib/auth/audit";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";

const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_BASE = { httpOnly: true, secure: IS_PROD, sameSite: "lax" as const, path: "/" };

async function handleLogout(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const rawRefreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
  if (rawRefreshToken) {
    await revokeRefreshToken(rawRefreshToken).catch((err) =>
      console.error("[logout] Failed to revoke refresh token", err)
    );
  }

  const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;

  const response = NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    { status: 303 }
  );
  response.cookies.set(COOKIE_ACCESS_TOKEN, "", { ...COOKIE_BASE, maxAge: 0 });
  response.cookies.set(COOKIE_REFRESH_TOKEN, "", { ...COOKIE_BASE, maxAge: 0 });

  await writeAuditLog({
    action: "logout",
    userId: payload?.sub ?? null,
    email: payload?.email ?? null,
    ip,
    userAgent,
  });

  return response;
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}
