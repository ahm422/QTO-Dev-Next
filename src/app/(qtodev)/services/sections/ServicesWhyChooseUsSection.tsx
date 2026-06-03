import { findPublishedWhyChooseUs } from "@/lib/cms/whyChooseUs";
import { ServicesWhyChooseUsSectionClient } from "./ServicesWhyChooseUsSectionClient";

export async function ServicesWhyChooseUsSection() {
  const items = await findPublishedWhyChooseUs("services");
  return <ServicesWhyChooseUsSectionClient items={items} />;
}
