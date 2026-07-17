import { findPublishedProcessSteps } from "@/lib/cms/processSteps";
import { HowWeWorkSectionClient } from "./HowWeWorkSectionClient";

export async function HowWeWorkSection() {
  const steps = await findPublishedProcessSteps("services");
  return <HowWeWorkSectionClient steps={steps} />;
}
