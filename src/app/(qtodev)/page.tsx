import { HeroSection } from "./sections/HeroSection";
import { AwardsCertificationsSection } from "./sections/AwardsCertificationsSection";
import { AboutCompanySection } from "./sections/AboutCompanySection";
import { OurServicesSection } from "./sections/OurServicesSection";
import { SuccessStoriesSection } from "./sections/SuccessStoriesSection";
import { HowWeWorkSection } from "./sections/HowWeWorkSection";
import { HighlightsSection } from "./sections/HighlightsSection";
import { CTASection } from "./sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AwardsCertificationsSection />
      <AboutCompanySection />
      <OurServicesSection />
      <HowWeWorkSection />
      <SuccessStoriesSection />
      <HighlightsSection />
      <CTASection />
    </>
  );
}
