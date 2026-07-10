"use client";

import { CTA } from "@/components/common/CTA";
import { careersPageConfig, type CareersPageConfig } from "@/config/careersPage";
import { analytics } from "@/lib/analytics";

export function CareersCTASection({ config }: { config?: CareersPageConfig }) {
  const cfg = config ?? careersPageConfig;
  const { cta } = cfg;

  return (
    <CTA
      title={cta.title}
      description={cta.description}
      primaryButtonText={cta.primaryButtonText}
      primaryButtonHref={cta.primaryButtonHref}
      secondaryButtonText={cta.secondaryButtonText}
      secondaryButtonHref={cta.secondaryButtonHref}
      onPrimaryClick={() => {
        analytics.trackEvent("careers_cta_click", {
          destination: "open_roles",
        });
      }}
    />
  );
}

