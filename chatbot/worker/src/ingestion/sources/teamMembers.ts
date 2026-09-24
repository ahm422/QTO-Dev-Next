import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { joinSections } from "../textUtils.js";

interface TeamMemberRow {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  linked_in: string | null;
  is_founder: number;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<TeamMemberRow[]> {
  return d1.query<TeamMemberRow>(
    `SELECT id, name, role, bio, linked_in, is_founder, is_published, "order", updated_at FROM team_members`
  );
}

function normalize(row: TeamMemberRow): NormalizedRecord {
  const heading = `${row.name} — ${row.role}${row.is_founder ? " (Founder)" : ""}`;
  const content = joinSections(heading, row.bio);

  return {
    table: "team_members",
    recordId: row.id,
    slug: null,
    title: row.name,
    content,
    metadata: {
      role: row.role,
      isFounder: row.is_founder === 1,
      linkedIn: row.linked_in,
      order: row.order,
      url: "/about",
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const teamMembersSource: SourceDefinition = {
  table: "team_members",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
