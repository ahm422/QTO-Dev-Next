import { CompanySnapshotSectionClient } from "./CompanySnapshotSectionClient";
import { aboutPageConfig } from "@/config/aboutPage";

type AboutPageConfigType = typeof aboutPageConfig;

export async function CompanySnapshotSection({
  config,
}: {
  config?: AboutPageConfigType;
}) {
  return <CompanySnapshotSectionClient config={config} />;
}
