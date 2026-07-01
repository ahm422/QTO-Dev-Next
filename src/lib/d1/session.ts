import { cache } from "react";
import { cookies, headers } from "next/headers";
import type { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const D1_BOOKMARK_COOKIE = "d1-bookmark";
export const D1_BOOKMARK_HEADER = "x-d1-bookmark";

const IS_PROD = process.env.NODE_ENV === "production";
const BOOKMARK_MAX_AGE = 7 * 24 * 60 * 60;

const BOOKMARK_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  path: "/",
  maxAge: BOOKMARK_MAX_AGE,
};

/** Default session constraint when no bookmark is present. Override via D1_SESSION_CONSTRAINT for cutover smoke tests. */
export function getD1SessionConstraint(): D1SessionConstraint {
  const env = process.env.D1_SESSION_CONSTRAINT;
  if (env === "first-primary" || env === "first-unconstrained") {
    return env;
  }
  return "first-unconstrained";
}

/** Read bookmark from request header (middleware) or cookie; fall back to session constraint. */
export async function getIncomingBookmark(): Promise<D1SessionBookmark | D1SessionConstraint> {
  const h = await headers();
  const headerBookmark = h.get(D1_BOOKMARK_HEADER);
  if (headerBookmark) return headerBookmark;

  const cookieStore = await cookies();
  const cookieBookmark = cookieStore.get(D1_BOOKMARK_COOKIE)?.value;
  if (cookieBookmark) return cookieBookmark;

  return getD1SessionConstraint();
}

export async function createD1Session(
  env: CloudflareEnv,
  bookmark?: D1SessionBookmark | D1SessionConstraint
): Promise<D1DatabaseSession> {
  if (!env.DB) {
    throw new Error(
      "D1 binding (env.DB) is not available. Use `npm run preview` (wrangler dev) with local D1 — plain `next dev` has no Workers bindings."
    );
  }
  const constraint = bookmark ?? (await getIncomingBookmark());
  return env.DB.withSession(constraint);
}

/** Per-request D1 session — shared by Prisma adapter and bookmark persistence. */
export const getD1Session = cache(async (): Promise<D1DatabaseSession> => {
  const { env } = getCloudflareContext();
  return createD1Session(env);
});

export async function getD1BookmarkForPersistence(): Promise<D1SessionBookmark | null> {
  const session = await getD1Session();
  return session.getBookmark();
}

/** Persist session bookmark to cookie (server actions / RSC). */
export async function persistD1Bookmark(): Promise<void> {
  const bookmark = await getD1BookmarkForPersistence();
  if (!bookmark) return;

  const cookieStore = await cookies();
  cookieStore.set(D1_BOOKMARK_COOKIE, bookmark, BOOKMARK_COOKIE_OPTIONS);
}

/** Append bookmark cookie to a Route Handler response. */
export function appendD1BookmarkCookie(
  response: NextResponse,
  bookmark: D1SessionBookmark | null | undefined
): void {
  if (!bookmark) return;
  response.cookies.set(D1_BOOKMARK_COOKIE, bookmark, BOOKMARK_COOKIE_OPTIONS);
}

/** Convenience for Route Handlers: read current session bookmark and set on response. */
export async function persistD1BookmarkOnResponse(response: NextResponse): Promise<void> {
  appendD1BookmarkCookie(response, await getD1BookmarkForPersistence());
}
