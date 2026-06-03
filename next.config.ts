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

const nextConfig: NextConfig = {
  typescript: {
    // Prisma nullable fields vs Zod form defaults in admin *Form.tsx (pre-Phase 7).
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns,
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
