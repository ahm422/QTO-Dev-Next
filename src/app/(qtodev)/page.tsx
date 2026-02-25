import { HeroSection } from "./sections/HeroSection";
import { AwardsCertificationsSection } from "./sections/AwardsCertificationsSection";
import { AboutCompanySection } from "./sections/AboutCompanySection";
import { OurServicesSection } from "./sections/OurServicesSection";
import { SuccessStoriesSection } from "./sections/SuccessStoriesSection";
import { HowWeWorkSection } from "./sections/HowWeWorkSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { FeaturedWorkSection } from "./sections/FeaturedWorkSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { StatsNumbersSection } from "./sections/StatsNumbersSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { IndustriesSection } from "./sections/IndustriesSection";
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
      <PortfolioSection />
      <FeaturedWorkSection />
      <WhyChooseUsSection />
      <StatsNumbersSection />
      <TestimonialsSection />
      <IndustriesSection />
      <SuccessStoriesSection />
      <HighlightsSection />
      <CTASection />
    </>
  );
}
