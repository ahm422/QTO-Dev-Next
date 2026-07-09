import { findPublishedWhyChooseUs } from "@/lib/cms/whyChooseUs";
import { servicesPageConfig } from "@/config/servicesPage";
import { ServicesWhyChooseUsSectionClient } from "./ServicesWhyChooseUsSectionClient";

type ServicesPageConfigType = typeof servicesPageConfig;

export async function ServicesWhyChooseUsSection({
  config,
}: {
  config?: ServicesPageConfigType;
}) {
  const items = await findPublishedWhyChooseUs("services");
  return <ServicesWhyChooseUsSectionClient items={items} config={config} />;
}
