import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { revokeAllUserTokens } from "@/lib/auth/tokens";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;
  const { id } = await params;

  const target = await prisma.adminUser.findUnique({ where: { id }, select: { id: true } });
  if (!target) return apiError(404, "Not found");

  try {
    const revoked = await revokeAllUserTokens(id);

    await writeAuditLog({
      action: AUDIT_ACTIONS.ADMIN_USER_FORCE_LOGOUT,
      userId: session!.user.id,
      email: session!.user.email,
      metadata: { targetUserId: id, revokedTokens: revoked },
    });

    return apiSuccess({ id, revokedTokens: revoked });
  } catch (e) {
    return handleRouteError("POST /api/admin/users/[id]/force-logout", e);
  }
}
