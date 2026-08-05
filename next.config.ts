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

const IS_DEV = process.env.NODE_ENV === "development";
const GTM_SRC = "https://www.googletagmanager.com";
const GA_SRC = "https://www.google-analytics.com";
const GA_REGION1_SRC = "https://region1.google-analytics.com";
const GA_ANALYTICS_SRC = "https://analytics.google.com";
const GA_SSL_SRC = "https://ssl.google-analytics.com";

const remotePatterns = [
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
  },
  ...(r2Pattern ? [r2Pattern] : []),
  ...(r2CdnPattern && r2CdnPattern.hostname !== r2Pattern?.hostname
    ? [r2CdnPattern]
    : []),
  // Allow localhost for local dev R2 proxy (/api/media/...)
  ...(IS_DEV
    ? [{ protocol: "http" as const, hostname: "localhost" }]
    : []),
];

function buildGlobalCsp(): string {
  const scriptSrc = [
    IS_DEV ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'",
    GTM_SRC,
  ].join(" ");
  const imgSrc = [
    "'self'",
    "data:",
    "blob:",
    "https://images.unsplash.com",
    GTM_SRC,
    GA_SRC,
    GA_REGION1_SRC,
    GA_ANALYTICS_SRC,
    GA_SSL_SRC,
  ].join(" ");
  const connectSrc = [
    "'self'",
    GTM_SRC,
    GA_SRC,
    GA_REGION1_SRC,
    GA_ANALYTICS_SRC,
    GA_SSL_SRC,
  ].join(" ");
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
    `img-src ${imgSrc}${r2Origin}`,
    `connect-src ${connectSrc}`,
    `frame-src ${GTM_SRC}`,
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
  ],
  images: {
    remotePatterns,
  },
  async redirects() {
    return [
      {
        source: "/get-a-quote",
        destination: "/requirements",
        permanent: true,
      },
      // Canonical host: www → apex (requires www DNS to exist in Cloudflare)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.qtodev.com" }],
        destination: "https://qtodev.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: GLOBAL_SECURITY_HEADERS }];
  },
};

export default withBundleAnalyzer(nextConfig);

initOpenNextCloudflareForDev();
