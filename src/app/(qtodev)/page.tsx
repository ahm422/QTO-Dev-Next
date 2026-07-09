import { HeroSection } from "./sections/HeroSection";
import { AboutCompanySection } from "./sections/AboutCompanySection";
import { OurServicesSection } from "./sections/OurServicesSection";
import { HowWeWorkSection } from "./sections/HowWeWorkSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { EngagementModelsSection } from "./sections/EngagementModelsSection";
import { FAQsSection } from "./sections/FAQsSection";
import { InsightsSection } from "./sections/InsightsSection";
import { StatsNumbersSection } from "./sections/StatsNumbersSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { IndustriesSection } from "./sections/IndustriesSection";
import { findPageSection } from "@/lib/cms/pageContent";

export default async function HomePage() {
  const [heroConfig, aboutCompanyConfig] = await Promise.all([
    findPageSection("homepage.hero"),
    findPageSection("homepage.about-company"),
  ]);

  return (
    <main
      id="main-content"
      className="min-h-0 bg-background selection:bg-primary/20 selection:text-foreground dark:selection:bg-primary/30"
    >
      <HeroSection config={heroConfig as any} />
      <AboutCompanySection config={aboutCompanyConfig as any} />
      <OurServicesSection />
      <HowWeWorkSection />
      <PortfolioSection />
      <WhyChooseUsSection />
      <StatsNumbersSection />
      <TestimonialsSection />
      <IndustriesSection />
      <EngagementModelsSection />
      <FAQsSection />
      <InsightsSection />
    </main>
  );
}
