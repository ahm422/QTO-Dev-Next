import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { teamMemberBaseSchema } from "@/lib/validators/admin/teamMember";
import { revalidateTeamCaches } from "@/lib/revalidate";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.teamMember.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/admin/team/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  // Base schema only — Zod v4 forbids .partial() on refined schemas.
  const parsed = teamMemberBaseSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    if (parsed.data.isFounder) {
      const existing = await prisma.teamMember.findUnique({
        where: { id },
        select: { avatarUrl: true },
      });
      const avatarUrl = parsed.data.avatarUrl ?? existing?.avatarUrl ?? "";
      if (!avatarUrl.trim()) {
        return apiError(400, "Validation failed", {
          fieldErrors: {
            avatarUrl: ["Avatar is required when featuring as Founder on the About page"],
          },
        });
      }
      await prisma.teamMember.updateMany({
        where: { id: { not: id }, isFounder: true },
        data: { isFounder: false },
      });
    }
    const item = await prisma.teamMember.update({ where: { id }, data: parsed.data });
    revalidateTeamCaches();
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "team",
      entityId: item.id,
      label: item.name,
    });
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/team/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.teamMember.findUnique({ where: { id }, select: { name: true } });
    await prisma.teamMember.delete({ where: { id } });
    revalidateTeamCaches();
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_DELETED,
      section: "team",
      entityId: id,
      label: existing?.name,
    });
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/team/[id]", e);
  }
}
