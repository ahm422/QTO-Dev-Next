import { HeroSection } from "./sections/HeroSection";
import { ServicesSection } from "./sections/ServicesSection";
import { SuccessStoriesSection } from "./sections/SuccessStoriesSection";
import { ProcessSection } from "./sections/ProcessSection";
import { HighlightsSection } from "./sections/HighlightsSection";
import { CTASection } from "./sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <SuccessStoriesSection />
      <ProcessSection />
      <HighlightsSection />
      <CTASection />
    </>
  );
}
