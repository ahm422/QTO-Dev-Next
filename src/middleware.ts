import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/constants";

const LOGIN_PATH = "/admin/login";
const UNAUTHORIZED_PATH = "/admin/unauthorized";
const ADMIN_HOME = "/admin";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;
  const isAuthenticated = payload !== null;
  const isAdmin = isAuthenticated && payload.role === "admin";

  if (pathname === LOGIN_PATH) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ADMIN_HOME, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === UNAUTHORIZED_PATH) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdmin) {
    return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
