import { findFounderTeamMember } from "@/lib/cms/team";
import { findAboutPageContent } from "@/lib/cms/about";
import { findPageSection } from "@/lib/cms/pageContent";
import { aboutPageConfig } from "@/config/aboutPage";
import { CeoSectionClient } from "./CeoSectionClient";

type AboutPageConfigType = typeof aboutPageConfig;

type CeoConfig = AboutPageConfigType["ceo"];

function resolveCeoStats(
  ceo: CeoConfig,
  company?: { team: number; projects: number; clients: number; founded: number } | null
) {
  if (ceo.stats?.length) return ceo.stats;

  if (!company) return ceo.stats;

  const currentYear = new Date().getFullYear();
  const years = Math.max(currentYear - company.founded, 1);

  return [
    { label: "Team Members", value: company.team, suffix: "+" },
    { label: "Projects Delivered", value: company.projects, suffix: "+" },
    { label: "Years Experience", value: years, suffix: "+" },
    { label: "Countries Served", value: 15, suffix: "+" },
  ];
}

export async function CeoSection({ config }: { config?: AboutPageConfigType }) {
  const founder = await findFounderTeamMember();
  if (!founder) return null;

  const cmsConfig = config ?? (await findPageSection("about.page")) as AboutPageConfigType | null;
  const ceo = cmsConfig?.ceo ?? aboutPageConfig.ceo;
  const aboutContent = await findAboutPageContent();
  const stats = resolveCeoStats(ceo, aboutContent?.company);

  return (
    <CeoSectionClient
      founder={founder}
      ceo={{ ...ceo, stats }}
    />
  );
}
