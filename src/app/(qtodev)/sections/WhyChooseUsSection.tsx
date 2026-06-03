import { findPublishedWhyChooseUs } from "@/lib/cms/whyChooseUs";
import { WhyChooseUsSectionClient } from "./WhyChooseUsSectionClient";

export async function WhyChooseUsSection() {
  const items = await findPublishedWhyChooseUs("homepage");
  return <WhyChooseUsSectionClient items={items} />;
}
