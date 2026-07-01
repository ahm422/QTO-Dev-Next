import { NextRequest, NextResponse } from "next/server";

/** Set FREEZE_WRITES=1 on the Worker during production cutover to block mutating requests. */
export function isWriteFrozen(): boolean {
  return process.env.FREEZE_WRITES === "1" || process.env.FREEZE_WRITES === "true";
}

const FROZEN_PUBLIC_POST_PREFIXES = [
  "/api/contact",
  "/api/requirements",
  "/api/careers/",
] as const;

function isMutatingMethod(method: string): boolean {
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

function isFrozenPublicPost(pathname: string, method: string): boolean {
  if (method !== "POST") return false;
  return FROZEN_PUBLIC_POST_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix)
  );
}

function isFrozenAdminMutation(pathname: string, method: string, request: NextRequest): boolean {
  if (!isMutatingMethod(method)) return false;

  if (pathname.startsWith("/api/admin/")) return true;

  if (pathname.startsWith("/admin/") && request.headers.has("next-action")) return true;

  return false;
}

export function writeFrozenResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "Service temporarily unavailable",
      message: "The site is undergoing scheduled maintenance. Please try again shortly.",
    },
    { status: 503, headers: { "Retry-After": "300" } }
  );
}

/** Returns a 503 response when writes are frozen and the request is mutating; otherwise null. */
export function checkWriteFreeze(request: NextRequest): NextResponse | null {
  if (!isWriteFrozen()) return null;

  const { pathname } = request.nextUrl;
  const { method } = request;

  if (isFrozenPublicPost(pathname, method) || isFrozenAdminMutation(pathname, method, request)) {
    return writeFrozenResponse();
  }

  return null;
}
