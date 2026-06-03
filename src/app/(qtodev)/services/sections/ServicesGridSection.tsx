import { findPublishedServices } from "@/lib/cms/services";
import { ServicesGridSectionClient } from "./ServicesGridSectionClient";

export async function ServicesGridSection() {
  const services = await findPublishedServices();
  return <ServicesGridSectionClient services={services} />;
}
