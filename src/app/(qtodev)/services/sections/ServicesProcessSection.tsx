import { findPublishedProcessSteps } from "@/lib/cms/processSteps";
import { ServicesProcessSectionClient } from "./ServicesProcessSectionClient";

export async function ServicesProcessSection() {
  const steps = await findPublishedProcessSteps("services");
  return <ServicesProcessSectionClient steps={steps} />;
}
