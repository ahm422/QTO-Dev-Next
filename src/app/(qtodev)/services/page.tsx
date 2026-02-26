import { ServicesHeroSection } from "./sections/ServicesHeroSection";
import { ServicesGridSection } from "./sections/ServicesGridSection";
import { ServicesProcessSection } from "./sections/ServicesProcessSection";
import { ServicesWhyChooseUsSection } from "./sections/ServicesWhyChooseUsSection";
import { ServicesCTASection } from "./sections/ServicesCTASection";

export default function ServicesPage() {
  return (
    <>
      <ServicesHeroSection />
      <ServicesGridSection />
      <ServicesProcessSection />
      <ServicesWhyChooseUsSection />
      <ServicesCTASection />
    </>
  );
}
