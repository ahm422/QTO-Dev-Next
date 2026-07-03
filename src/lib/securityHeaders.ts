import type { NextResponse } from "next/server";

const IS_DEV = process.env.NODE_ENV === "development";

function buildR2ImgSrc(): string {
  const url = process.env.R2_PUBLIC_URL;
  if (!url) return "";
  try {
    const { origin } = new URL(url);
    return ` ${origin}`;
  } catch {
    return "";
  }
}

const R2_IMG_SRC = buildR2ImgSrc();

function buildCsp(): string {
  const scriptSrc = IS_DEV
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' fonts.gstatic.com",
    `img-src 'self' data: blob: https://images.unsplash.com${R2_IMG_SRC}`,
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  return directives.join("; ");
}

const CSP = buildCsp();

export function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set("Content-Security-Policy", CSP);
}
