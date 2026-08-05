import { AboutHeroSection } from "./sections/AboutHeroSection";
import { CompanySnapshotSection } from "./sections/CompanySnapshotSection";
import { ImpactStatsSection } from "./sections/ImpactStatsSection";
import { CeoSection } from "./sections/CeoSection";
import { MissionVisionSection } from "./sections/MissionVisionSection";
import { ValuesSection } from "./sections/ValuesSection";
import { LeadershipSection } from "./sections/LeadershipSection";
import { TrustSection } from "./sections/TrustSection";
import { CTA } from "@/components/common/CTA";
import { aboutPageConfig } from "@/config/aboutPage";
import { findPageSection } from "@/lib/cms/pageContent";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "About | QTO Dev",
  description:
    "Learn about QTO Dev — our mission, values, and the team building premium web and product experiences.",
  url: "/about",
});

export default async function AboutPage() {
  const cmsConfig = await findPageSection("about.page") as typeof aboutPageConfig | null;
  const cfg = cmsConfig ?? aboutPageConfig;
  const { cta } = cfg;
  return (
    <>
      <AboutHeroSection config={cmsConfig ?? undefined} />
      <CompanySnapshotSection config={cmsConfig ?? undefined} />
      <ImpactStatsSection />
      <CeoSection config={cmsConfig ?? undefined} />
      <MissionVisionSection config={cmsConfig ?? undefined} />
      <ValuesSection config={cmsConfig ?? undefined} />
      <LeadershipSection />
      <TrustSection config={cmsConfig ?? undefined} />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
