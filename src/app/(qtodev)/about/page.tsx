import { AboutHeroSection } from "./sections/AboutHeroSection";
import { CompanySnapshotSection } from "./sections/CompanySnapshotSection";
import { MissionVisionSection } from "./sections/MissionVisionSection";
import { ValuesSection } from "./sections/ValuesSection";
import { LeadershipSection } from "./sections/LeadershipSection";
import { TrustSection } from "./sections/TrustSection";
import { CTA } from "@/components/common/CTA";
import { aboutPageConfig } from "@/config/aboutPage";

export default function AboutPage() {
  const { cta } = aboutPageConfig;
  return (
    <>
      <AboutHeroSection />
      <CompanySnapshotSection />
      <MissionVisionSection />
      <ValuesSection />
      <LeadershipSection />
      <TrustSection />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
