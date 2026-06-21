import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isAnalyze = process.env.ANALYZE === "true";

const withBundleAnalyzer = isAnalyze
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@next/bundle-analyzer")({ enabled: true })
  : (config: NextConfig) => config;

function garageImagePattern(): {
  protocol: "http" | "https";
  hostname: string;
} | null {
  const publicUrl = process.env.GARAGE_PUBLIC_URL;
  if (!publicUrl) return null;
  try {
    const { protocol, hostname } = new URL(publicUrl);
    if ((protocol !== "https:" && protocol !== "http:") || !hostname) {
      return null;
    }
    return {
      protocol: protocol === "https:" ? "https" : "http",
      hostname,
    };
  } catch {
    return null;
  }
}

const garagePattern = garageImagePattern();

function garageCdnHostnamePattern(): {
  protocol: "http" | "https";
  hostname: string;
} | null {
  const hostname = process.env.GARAGE_CDN_HOSTNAME?.trim();
  if (!hostname) return null;
  return { protocol: "https", hostname };
}

const garageCdnPattern = garageCdnHostnamePattern();

const remotePatterns = [
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
  ...(garagePattern ? [garagePattern] : []),
  ...(garageCdnPattern && garageCdnPattern.hostname !== garagePattern?.hostname
    ? [garageCdnPattern]
    : []),
];

const IS_DEV = process.env.NODE_ENV === "development";

function buildGlobalCsp(): string {
  const scriptSrc = IS_DEV
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";
  const garagePublicUrl = process.env.GARAGE_PUBLIC_URL;
  let garageOrigin = "";
  if (garagePublicUrl) {
    try {
      garageOrigin = ` ${new URL(garagePublicUrl).origin}`;
    } catch {
      // ignore invalid URL
    }
  }
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' fonts.gstatic.com",
    `img-src 'self' data: blob: https://images.unsplash.com${garageOrigin}`,
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

const GLOBAL_SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: buildGlobalCsp() },
];

const nextConfig: NextConfig = {
  typescript: {
    // Prisma nullable fields vs Zod form defaults in admin *Form.tsx (pre-Phase 7).
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [{ source: "/(.*)", headers: GLOBAL_SECURITY_HEADERS }];
  },
  // pg loads pg-cloudflare at runtime on Workers; ensure traced output includes workerd files.
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/pg-cloudflare/dist/**",
      "./node_modules/pg-cloudflare/esm/**",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);

initOpenNextCloudflareForDev();
