import { HowWeWorkSection } from "../sections/HowWeWorkSection";
import { ServicesHeroSection } from "./sections/ServicesHeroSection";
import { ServicesGridSection } from "./sections/ServicesGridSection";
import { ServicesTechnologiesSection } from "./sections/ServicesTechnologiesSection";
import { ServicesWhyChooseUsSection } from "./sections/ServicesWhyChooseUsSection";
import { ServicesCTASection } from "./sections/ServicesCTASection";
import { servicesPageConfig } from "@/config/servicesPage";
import { findPageSection } from "@/lib/cms/pageContent";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Services | QTO Dev",
  description:
    "Web development, mobile apps, UI/UX design, and product engineering services from QTO Dev.",
  url: "/services",
});

export default async function ServicesPage() {
  const cmsConfig = await findPageSection("services.page") as typeof servicesPageConfig | null;
  const cfg = cmsConfig ?? undefined;
  return (
    <>
      <ServicesHeroSection config={cfg} />
      <HowWeWorkSection />
      <ServicesGridSection config={cfg} />
      <ServicesTechnologiesSection config={cfg} />
      <ServicesWhyChooseUsSection config={cfg} />
      <ServicesCTASection config={cfg} />
    </>
  );
}
