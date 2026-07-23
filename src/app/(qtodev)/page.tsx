import { HeroSection } from "./sections/HeroSection";
import { OurServicesSection } from "./sections/OurServicesSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";
import { EngagementModelsSection } from "./sections/EngagementModelsSection";
import { FAQsSection } from "./sections/FAQsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { IndustriesSection } from "./sections/IndustriesSection";
import { CeoSection } from "./about/sections/CeoSection";
import { resolveHeroConfig } from "@/config/hero";
import { findPageSection } from "@/lib/cms/pageContent";

export default async function HomePage() {
  const cmsHero = await findPageSection("homepage.hero");

  return (
    <main
      id="main-content"
      className="min-h-0 bg-background selection:bg-primary/20 selection:text-foreground dark:selection:bg-primary/30"
    >
      <HeroSection config={resolveHeroConfig(cmsHero)} />
      <OurServicesSection />
      <PortfolioSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <IndustriesSection />
      <EngagementModelsSection />
      <CeoSection compact />
      <FAQsSection />
    </main>
  );
}
