"use client";

import { CTA } from "@/components/common/CTA";
import { careersPageConfig } from "@/config/careersPage";
import { analytics } from "@/lib/analytics";

export function CareersCTASection() {
  const { cta } = careersPageConfig;

  return (
    <CTA
      title={cta.title}
      description={cta.description}
      primaryButtonText={cta.primaryButtonText}
      primaryButtonHref={cta.primaryButtonHref}
      secondaryButtonText={cta.secondaryButtonText}
      secondaryButtonHref={cta.secondaryButtonHref}
      onPrimaryClick={() => {
        analytics.trackEvent("careers_general_application_click");
      }}
    />
  );
}

