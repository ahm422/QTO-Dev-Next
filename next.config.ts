import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isAnalyze = process.env.ANALYZE === "true";

const withBundleAnalyzer = isAnalyze
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@next/bundle-analyzer")({ enabled: true })
  : (config: NextConfig) => config;

function r2ImagePattern(): {
  protocol: "http" | "https";
  hostname: string;
} | null {
  const publicUrl = process.env.R2_PUBLIC_URL;
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

const r2Pattern = r2ImagePattern();

function r2CdnHostnamePattern(): {
  protocol: "http" | "https";
  hostname: string;
} | null {
  const hostname = process.env.R2_CDN_HOSTNAME?.trim();
  if (!hostname) return null;
  return { protocol: "https", hostname };
}

const r2CdnPattern = r2CdnHostnamePattern();

const remotePatterns = [
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
  ...(r2Pattern ? [r2Pattern] : []),
  ...(r2CdnPattern && r2CdnPattern.hostname !== r2Pattern?.hostname
    ? [r2CdnPattern]
    : []),
];

const IS_DEV = process.env.NODE_ENV === "development";

function buildGlobalCsp(): string {
  const scriptSrc = IS_DEV
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";
  const r2PublicUrl = process.env.R2_PUBLIC_URL;
  let r2Origin = "";
  if (r2PublicUrl) {
    try {
      r2Origin = ` ${new URL(r2PublicUrl).origin}`;
    } catch {
      // ignore invalid URL
    }
  }
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' fonts.gstatic.com",
    `img-src 'self' data: blob: https://images.unsplash.com${r2Origin}`,
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
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@prisma/adapter-d1",
    "@prisma/adapter-pg",
  ],
  images: {
    remotePatterns,
  },
  async headers() {
    return [{ source: "/(.*)", headers: GLOBAL_SECURITY_HEADERS }];
  },
};

export default withBundleAnalyzer(nextConfig);

initOpenNextCloudflareForDev();
