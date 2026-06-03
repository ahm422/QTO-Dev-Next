import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const LOGIN_PATH = "/admin/login";
const UNAUTHORIZED_PATH = "/admin/unauthorized";
const ADMIN_HOME = "/admin";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (pathname === LOGIN_PATH) {
    if (session?.user) {
      return NextResponse.redirect(new URL(ADMIN_HOME, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === UNAUTHORIZED_PATH) {
    return NextResponse.next();
  }

  if (!session?.user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.user.role !== "admin") {
    return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
