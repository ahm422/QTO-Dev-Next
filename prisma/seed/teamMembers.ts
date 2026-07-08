import { leadershipTeam } from "@/data/leadership";
import { prisma, upsertBy } from "./helpers";

export async function seedTeamMembers() {
  for (let i = 0; i < leadershipTeam.length; i++) {
    const member = leadershipTeam[i];
    const isFounder = member.id === "ceo";
    await upsertBy(
      () => prisma.teamMember.findFirst({ where: { name: member.name } }),
      () =>
        prisma.teamMember.create({
          data: {
            name: member.name,
            role: member.designation,
            bio: member.bio ?? null,
            avatarUrl: member.imageUrl ?? null,
            order: i,
            isPublished: true,
            isFounder,
          },
        }),
      (existing) =>
        prisma.teamMember.update({
          where: { id: existing.id },
          data: {
            role: member.designation,
            bio: member.bio ?? null,
            avatarUrl: member.imageUrl ?? null,
            order: i,
            isPublished: true,
            isFounder,
          },
        })
    );
  }
}
