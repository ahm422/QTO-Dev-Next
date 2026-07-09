import { findPublishedServices } from "@/lib/cms/services";
import { servicesPageConfig } from "@/config/servicesPage";
import { ServicesGridSectionClient } from "./ServicesGridSectionClient";

type ServicesPageConfigType = typeof servicesPageConfig;

export async function ServicesGridSection({
  config,
}: {
  config?: ServicesPageConfigType;
}) {
  const services = await findPublishedServices();
  return <ServicesGridSectionClient services={services} config={config} />;
}
