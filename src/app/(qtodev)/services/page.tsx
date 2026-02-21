import { ServicesHeroSection } from "./sections/ServicesHeroSection";
import { ServicesGridSection } from "./sections/ServicesGridSection";
import { ServicesCTASection } from "./sections/ServicesCTASection";

export default function ServicesPage() {
  return (
    <>
      <ServicesHeroSection />
      <ServicesGridSection />
      <ServicesCTASection />
    </>
  );
}
