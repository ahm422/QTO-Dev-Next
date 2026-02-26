import { HeroSection } from "./sections/HeroSection";
import { AwardsCertificationsSection } from "./sections/AwardsCertificationsSection";
import { AboutCompanySection } from "./sections/AboutCompanySection";
import { OurServicesSection } from "./sections/OurServicesSection";
import { HowWeWorkSection } from "./sections/HowWeWorkSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { FeaturedWorkSection } from "./sections/FeaturedWorkSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { EngagementModelsSection } from "./sections/EngagementModelsSection";
import { FAQsSection } from "./sections/FAQsSection";
import { InsightsSection } from "./sections/InsightsSection";
import { PartnerUpSection } from "./sections/PartnerUpSection";
import { BuildSomethingRealSection } from "./sections/BuildSomethingRealSection";
import { StatsNumbersSection } from "./sections/StatsNumbersSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { IndustriesSection } from "./sections/IndustriesSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AwardsCertificationsSection />
      <AboutCompanySection />
      <OurServicesSection />
      <HowWeWorkSection />
      <PortfolioSection />
      <FeaturedWorkSection />
      <WhyChooseUsSection />
      <StatsNumbersSection />
      <TestimonialsSection />
      <IndustriesSection />
      <EngagementModelsSection />
      <FAQsSection />
      <InsightsSection />
      <PartnerUpSection />
      <BuildSomethingRealSection />
    </>
  );
}
