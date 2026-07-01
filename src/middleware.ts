import { NextRequest, NextResponse } from "next/server";
import { decodeAccessToken } from "@/lib/auth/jwt";
import { isRoleAllowedForPath } from "@/lib/auth/adminRoutes";
import { applySecurityHeaders } from "@/lib/securityHeaders";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";
import { sanitizeAdminRedirect } from "@/lib/auth/redirect";
import { checkAuthGlobalRateLimit, rateLimitExceededResponse } from "@/lib/auth/rate-limit";
import { D1_BOOKMARK_COOKIE, D1_BOOKMARK_HEADER } from "@/lib/d1/session";

const LOGIN_PATH = "/admin/login";
const UNAUTHORIZED_PATH = "/admin/unauthorized";
const FORGOT_PASSWORD_PATH = "/admin/forgot-password";
const RESET_PASSWORD_PATH = "/admin/reset-password";
const ADMIN_HOME = "/admin";

const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_BASE = `; Path=/; HttpOnly${IS_PROD ? "; Secure" : ""}; SameSite=Lax`;

function clearCookiesOnResponse(response: NextResponse): void {
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_ACCESS_TOKEN}=; Max-Age=0${COOKIE_BASE}`
  );
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_REFRESH_TOKEN}=; Max-Age=0${COOKIE_BASE}`
  );
}

function extractCookieValue(setCookieHeaders: string[], name: string): string | null {
  const line = setCookieHeaders.find((h) => h.startsWith(`${name}=`));
  return line ? line.split(";")[0].split("=").slice(1).join("=") : null;
}

function applyD1BookmarkHeader(request: NextRequest, requestHeaders: Headers): void {
  const bookmark = request.cookies.get(D1_BOOKMARK_COOKIE)?.value;
  if (bookmark) {
    requestHeaders.set(D1_BOOKMARK_HEADER, bookmark);
  }
}

function forwardWithD1Bookmark(
  request: NextRequest,
  init?: { setCookies?: string[] | null }
): NextResponse {
  const requestHeaders = new Headers(request.headers);
  applyD1BookmarkHeader(request, requestHeaders);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (init?.setCookies) {
    for (const c of init.setCookies) response.headers.append("Set-Cookie", c);
  }
  applySecurityHeaders(response);
  return response;
}

function redirectToLogin(request: NextRequest, pathname: string, clearCookies = false): NextResponse {
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("redirectTo", sanitizeAdminRedirect(pathname));
  const response = NextResponse.redirect(loginUrl);
  if (clearCookies) clearCookiesOnResponse(response);
  applySecurityHeaders(response);
  return response;
}

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Public CMS / contact API routes — forward D1 bookmark only (no admin auth)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    return forwardWithD1Bookmark(request);
  }

  // Layer 3 — global auth rate limit on all /api/auth/* routes (100 req / 15 min per IP)
  // Note: the internal attemptRefresh() fetch also passes through here, which is intentional.
  if (pathname.startsWith("/api/auth/")) {
    const result = await checkAuthGlobalRateLimit(request);
    if (!result.allowed) return rateLimitExceededResponse(result.retryAfterSeconds);
    return forwardWithD1Bookmark(request);
  }

  // Public admin paths — always allow; just add security headers
  if (
    pathname === LOGIN_PATH ||
    pathname === UNAUTHORIZED_PATH ||
    pathname === FORGOT_PASSWORD_PATH ||
    pathname === RESET_PASSWORD_PATH ||
    pathname.startsWith("/admin/logout")
  ) {
    const response = forwardWithD1Bookmark(request);

    // For login page: if already authenticated, redirect to admin home
    if (pathname === LOGIN_PATH) {
      const at = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
      if (at) {
        const decoded = await decodeAccessToken(at);
        if (decoded.status === "valid") {
          const redirect = NextResponse.redirect(new URL(ADMIN_HOME, request.url));
          applySecurityHeaders(redirect);
          return redirect;
        }
        // Expired at on login page → try refresh; if ok redirect to admin, else let login render
        if (decoded.status === "expired") {
          const rt = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
          if (rt) {
            const refreshed = await attemptRefresh(request);
            if (refreshed) {
              const redirect = NextResponse.redirect(new URL(ADMIN_HOME, request.url));
              const setCookies = refreshed.headers.getSetCookie();
              for (const c of setCookies) response.headers.append("Set-Cookie", c);
              applySecurityHeaders(redirect);
              return redirect;
            }
          }
        }
      }
    }

    return response;
  }

  // Protected /admin/* — full auth flow
  const at = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value;
  const decoded = at ? await decodeAccessToken(at) : { status: "expired" as const };

  if (decoded.status === "valid") {
    return forwardAuthenticated(request, decoded.payload, null);
  }

  if (decoded.status === "expired") {
    const rt = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;
    if (!rt) return redirectToLogin(request, pathname);

    const refreshRes = await attemptRefresh(request);
    if (!refreshRes) return redirectToLogin(request, pathname, true);

    const setCookies = refreshRes.headers.getSetCookie();
    const newAt = extractCookieValue(setCookies, COOKIE_ACCESS_TOKEN);
    const newDecoded = newAt ? await decodeAccessToken(newAt) : null;
    const newPayload = newDecoded?.status === "valid" ? newDecoded.payload : null;

    return forwardAuthenticated(request, newPayload, setCookies);
  }

  // status === "invalid" — tampered token, do not refresh
  return redirectToLogin(request, pathname, true);
}

async function attemptRefresh(request: NextRequest): Promise<Response | null> {
  try {
    const refreshUrl = new URL("/api/auth/refresh", request.url);
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

function forwardAuthenticated(
  request: NextRequest,
  payload: { sub: string; email: string; role: string } | null,
  setCookies: string[] | null
): NextResponse {
  const { pathname } = request.nextUrl;

  if (payload && !isRoleAllowedForPath(payload.role, pathname)) {
    const response = NextResponse.redirect(new URL(UNAUTHORIZED_PATH, request.url));
    applySecurityHeaders(response);
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  applyD1BookmarkHeader(request, requestHeaders);
  if (payload) {
    requestHeaders.set("x-user-id", payload.sub);
    requestHeaders.set("x-user-role", payload.role);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (setCookies) {
    for (const c of setCookies) response.headers.append("Set-Cookie", c);
  }
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
