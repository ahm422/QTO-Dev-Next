import type { NextResponse } from "next/server";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "./constants";

const IS_PROD = process.env.NODE_ENV === "production";

const BASE_COOKIE = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string }
) {
  response.cookies.set(COOKIE_ACCESS_TOKEN, accessToken, {
    ...BASE_COOKIE,
    maxAge: 15 * 60,
  });
  response.cookies.set(COOKIE_REFRESH_TOKEN, refreshToken, {
    ...BASE_COOKIE,
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(COOKIE_ACCESS_TOKEN, "", { ...BASE_COOKIE, maxAge: 0 });
  response.cookies.set(COOKIE_REFRESH_TOKEN, "", { ...BASE_COOKIE, maxAge: 0 });
}
