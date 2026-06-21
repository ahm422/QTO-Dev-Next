import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedServices } from "@/lib/cms/services";
import { OurServicesSectionClient } from "./OurServicesSectionClient";

export async function OurServicesSection() {
  const [services, sectionConfig] = await Promise.all([
    findPublishedServices(),
    findPageSection("homepage.our-services"),
  ]);
  return <OurServicesSectionClient services={services} config={sectionConfig as any} />;
}
