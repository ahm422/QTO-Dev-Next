import { findPublishedServices } from "@/lib/cms/services";
import { OurServicesSectionClient } from "./OurServicesSectionClient";

export async function OurServicesSection() {
  const services = await findPublishedServices();
  return <OurServicesSectionClient services={services} />;
}
