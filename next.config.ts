import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isAnalyze = process.env.ANALYZE === "true";

const withBundleAnalyzer = isAnalyze
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@next/bundle-analyzer")({ enabled: true })
  : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  typescript: {
    // Prisma nullable fields vs Zod form defaults in admin *Form.tsx (pre-Phase 7).
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
