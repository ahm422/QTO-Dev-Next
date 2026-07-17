import { generateSEOMetadata } from "@/lib/seo";
import { CareersHeroSection } from "./sections/CareersHeroSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { WhyWorkWithUsSection } from "./sections/WhyWorkWithUsSection";
import { OpenPositionsSection } from "./sections/OpenPositionsSection";
import { careersPageConfig, resolveCareersPageConfig } from "@/config/careersPage";
import { findPageSection } from "@/lib/cms/pageContent";

export const metadata = generateSEOMetadata({
  title: "Careers at QTO Dev",
  description:
    "Join QTO Dev and build impactful digital products with a team that values craft, learning, and flexible, modern ways of working.",
  url: "/careers",
});

export default async function CareersPage() {
  const cmsConfig = (await findPageSection("careers.page")) as typeof careersPageConfig | null;
  const cfg = resolveCareersPageConfig(cmsConfig);
  return (
    <>
      <CareersHeroSection config={cfg} />
      <OpenPositionsSection />
      <WhyWorkWithUsSection config={cfg} />
      <BenefitsSection config={cfg} />
    </>
  );
}
