import { findFounderTeamMember } from "@/lib/cms/team";
import { findAboutPageContent } from "@/lib/cms/about";
import { findPageSection } from "@/lib/cms/pageContent";
import { aboutPageConfig } from "@/config/aboutPage";
import { leadershipTeam } from "@/data/leadership";
import type { LeadershipMember } from "@/types/leadership";
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

function getStaticCeo(): LeadershipMember {
  const ceo = leadershipTeam.find((m) => m.id === "ceo");
  if (!ceo) {
    throw new Error('leadershipTeam is missing the required "ceo" entry');
  }
  return ceo;
}

/** Prefer CMS founder fields; keep static portrait when CMS avatar is empty. */
function resolveCeoFounder(
  cms: LeadershipMember | null,
  staticCeo: LeadershipMember
): LeadershipMember {
  if (!cms) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[CeoSection] No published founder in CMS; using leadershipTeam ceo fallback"
      );
    }
    return staticCeo;
  }

  return {
    ...staticCeo,
    id: cms.id,
    name: cms.name,
    designation: cms.designation,
    bio: cms.bio || staticCeo.bio,
    linkedIn: cms.linkedIn ?? staticCeo.linkedIn,
    imageUrl: cms.imageUrl || staticCeo.imageUrl,
  };
}

export async function CeoSection({
  config,
  compact = false,
}: {
  config?: AboutPageConfigType;
  compact?: boolean;
}) {
  const staticCeo = getStaticCeo();
  const cmsFounder = await findFounderTeamMember();
  const founder = resolveCeoFounder(cmsFounder, staticCeo);

  const cmsConfig = config ?? (await findPageSection("about.page")) as AboutPageConfigType | null;
  const ceo = cmsConfig?.ceo ?? aboutPageConfig.ceo;
  const aboutContent = await findAboutPageContent();
  const stats = resolveCeoStats(ceo, aboutContent?.company);

  return (
    <CeoSectionClient
      founder={founder}
      ceo={{ ...ceo, stats }}
      compact={compact}
    />
  );
}
