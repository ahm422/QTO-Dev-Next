import { findPublishedTechnologies } from "@/lib/cms/technologies";
import { ServicesTechnologiesSectionClient } from "./ServicesTechnologiesSectionClient";

export async function ServicesTechnologiesSection() {
  const rows = await findPublishedTechnologies();
  const technologies = rows.map((t) => t.name);
  return <ServicesTechnologiesSectionClient technologies={technologies} />;
}
