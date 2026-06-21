import { ServicesHeroSection } from "./sections/ServicesHeroSection";
import { ServicesGridSection } from "./sections/ServicesGridSection";
import { ServicesTechnologiesSection } from "./sections/ServicesTechnologiesSection";
import { ServicesProcessSection } from "./sections/ServicesProcessSection";
import { ServicesWhyChooseUsSection } from "./sections/ServicesWhyChooseUsSection";
import { ServicesCTASection } from "./sections/ServicesCTASection";
import { servicesPageConfig } from "@/config/servicesPage";
import { findPageSection } from "@/lib/cms/pageContent";

export default async function ServicesPage() {
  const cmsConfig = await findPageSection("services.page") as typeof servicesPageConfig | null;
  const cfg = cmsConfig ?? undefined;
  return (
    <>
      <ServicesHeroSection config={cfg} />
      <ServicesGridSection />
      <ServicesTechnologiesSection />
      <ServicesProcessSection />
      <ServicesWhyChooseUsSection />
      <ServicesCTASection config={cfg} />
    </>
  );
}
