"use client";

import { CTA } from "@/components/common/CTA";
import { careersPageConfig } from "@/config/careersPage";
type CareersPageConfigType = typeof careersPageConfig;
import { analytics } from "@/lib/analytics";

export function CareersCTASection({ config }: { config?: CareersPageConfigType }) {
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
        analytics.trackEvent("careers_portal_click", {
          destination: "career_portal_home",
        });
      }}
    />
  );
}

