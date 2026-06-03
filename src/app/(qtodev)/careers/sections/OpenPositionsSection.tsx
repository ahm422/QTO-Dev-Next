import { findPublishedJobs } from "@/lib/cms/jobs";
import { OpenPositionsSectionClient } from "./OpenPositionsSectionClient";

export async function OpenPositionsSection() {
  const jobs = await findPublishedJobs();
  return <OpenPositionsSectionClient jobs={jobs} />;
}
