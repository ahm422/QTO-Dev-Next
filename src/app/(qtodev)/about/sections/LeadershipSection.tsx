import { findPublishedTeamMembers } from "@/lib/cms/team";
import { LeadershipSectionClient } from "./LeadershipSectionClient";

export async function LeadershipSection() {
  const team = await findPublishedTeamMembers();
  return <LeadershipSectionClient team={team} />;
}
