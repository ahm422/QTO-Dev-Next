import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { updateAdminUserSchema } from "@/lib/validators/admin/adminUser";
import { revokeAllUserTokens } from "@/lib/auth/tokens";
import { writeAuditLog } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";

const SAFE_SELECT = {
  id: true,
  email: true,
  role: true,
  displayName: true,
  isActive: true,
  lastLoginAt: true,
  lastLoginIp: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const user = await prisma.adminUser.findUnique({ where: { id }, select: SAFE_SELECT });
    if (!user) return apiError(404, "Not found");
    return apiSuccess({ user });
  } catch (e) {
    return handleRouteError("GET /api/admin/users/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;
  const { id } = await params;

  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;

  const parsed = updateAdminUserSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  }

  const changes = parsed.data;

  // Safeguard: cannot modify self via this endpoint (use profile settings instead)
  if (id === session!.user.id) {
    return apiError(400, "Cannot modify your own account via this endpoint.");
  }

  // Safeguard: cannot demote last active super_admin
  let previousRole: string | undefined;
  if (changes.role && changes.role !== "super_admin") {
    const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } });
    previousRole = target?.role;
    if (target?.role === "super_admin") {
      const count = await prisma.adminUser.count({
        where: { role: "super_admin", isActive: true },
      });
      if (count <= 1) {
        return apiError(409, "Cannot demote the last active super_admin.");
      }
    }
  } else if (changes.role) {
    const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } });
    previousRole = target?.role;
  }

  try {
    const user = await prisma.adminUser.update({
      where: { id },
      data: changes,
      select: SAFE_SELECT,
    });

    if (changes.role !== undefined) {
      await writeAuditLog({
        action: AUDIT_ACTIONS.ADMIN_ROLE_CHANGED,
        userId: session!.user.id,
        email: session!.user.email,
        metadata: { targetUserId: id, previousRole, newRole: changes.role },
      });
    }

    const otherChanges = Object.fromEntries(
      Object.entries(changes).filter(([k]) => k !== "role")
    );
    if (Object.keys(otherChanges).length > 0) {
      await writeAuditLog({
        action: AUDIT_ACTIONS.ADMIN_USER_UPDATED,
        userId: session!.user.id,
        email: session!.user.email,
        metadata: { targetUserId: id, changes: otherChanges },
      });
    }

    return apiSuccess({ user });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/users/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;
  const { id } = await params;

  // Safeguard: cannot deactivate self
  if (id === session!.user.id) {
    return apiError(400, "Cannot deactivate your own account.");
  }

  // Safeguard: cannot deactivate last active super_admin
  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: { role: true, isActive: true },
  });
  if (!target) return apiError(404, "Not found");

  if (target.role === "super_admin" && target.isActive) {
    const count = await prisma.adminUser.count({
      where: { role: "super_admin", isActive: true },
    });
    if (count <= 1) {
      return apiError(409, "Cannot deactivate the last active super_admin.");
    }
  }

  try {
    await prisma.adminUser.update({ where: { id }, data: { isActive: false } });
    await revokeAllUserTokens(id);

    await writeAuditLog({
      action: AUDIT_ACTIONS.ADMIN_DEACTIVATED,
      userId: session!.user.id,
      email: session!.user.email,
      metadata: { targetUserId: id },
    });

    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/users/[id]", e);
  }
}
