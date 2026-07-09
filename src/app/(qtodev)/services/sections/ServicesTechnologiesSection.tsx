import { findPublishedTechnologies } from "@/lib/cms/technologies";
import { servicesPageConfig } from "@/config/servicesPage";
import { ServicesTechnologiesSectionClient } from "./ServicesTechnologiesSectionClient";

type ServicesPageConfigType = typeof servicesPageConfig;

export async function ServicesTechnologiesSection({
  config,
}: {
  config?: ServicesPageConfigType;
}) {
  const rows = await findPublishedTechnologies();
  const technologies = rows.map((t) => ({ name: t.name, iconKey: t.iconKey }));
  return (
    <ServicesTechnologiesSectionClient technologies={technologies} config={config} />
  );
}
