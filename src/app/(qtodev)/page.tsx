import { heroConfig } from "@/config/hero";
import { HeroSection } from "./sections/HeroSection";
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

const firstHeroImage = heroConfig.heroImages?.[0];

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="min-h-0 bg-background selection:bg-primary/20 selection:text-foreground dark:selection:bg-primary/30"
    >
      {firstHeroImage ? (
        <link rel="preload" href={firstHeroImage} as="image" />
      ) : null}
      <HeroSection />
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
    </main>
  );
}
