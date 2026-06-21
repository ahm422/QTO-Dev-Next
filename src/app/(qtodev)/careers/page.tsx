import { generateSEOMetadata } from "@/lib/seo";
import { CareersHeroSection } from "./sections/CareersHeroSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { CultureSection } from "./sections/CultureSection";
import { WhyWorkWithUsSection } from "./sections/WhyWorkWithUsSection";
import { OpenPositionsSection } from "./sections/OpenPositionsSection";
import { CareersCTASection } from "./sections/CareersCTASection";
import { careersPageConfig } from "@/config/careersPage";
import { findPageSection } from "@/lib/cms/pageContent";

export const metadata = generateSEOMetadata({
  title: "Careers at QTO Dev",
  description:
    "Join QTO Dev and build impactful digital products with a team that values craft, learning, and flexible, modern ways of working.",
  url: "/careers",
});

export default async function CareersPage() {
  const cmsConfig = await findPageSection("careers.page") as typeof careersPageConfig | null;
  const cfg = cmsConfig ?? undefined;
  return (
    <>
      <CareersHeroSection config={cfg} />
      <WhyWorkWithUsSection config={cfg} />
      <BenefitsSection config={cfg} />
      <CultureSection config={cfg} />
      <OpenPositionsSection />
      <CareersCTASection config={cfg} />
    </>
  );
}
