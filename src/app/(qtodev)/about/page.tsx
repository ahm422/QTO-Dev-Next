import { AboutHeroSection } from "./sections/AboutHeroSection";
import { CompanySnapshotSection } from "./sections/CompanySnapshotSection";
import { MissionSection } from "./sections/MissionSection";
import { ValuesSection } from "./sections/ValuesSection";
import { VisionSection } from "./sections/VisionSection";
import { WhatWeDoSection } from "./sections/WhatWeDoSection";
import { TrustSection } from "./sections/TrustSection";
import { CTA } from "@/components/common/CTA";

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <CompanySnapshotSection />
      <MissionSection />
      <ValuesSection />
      <VisionSection />
      <WhatWeDoSection />
      <TrustSection />
      <CTA
        title="Let's Work Together"
        description="Ready to partner with a team that cares about your success?"
        primaryButtonText="Schedule a Call"
        primaryButtonHref="/contact"
      />
    </>
  );
}
