import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { createAdminUserSchema } from "@/lib/validators/admin/adminUser";
import { hashPassword } from "@/lib/auth/password";
import { writeAuditLog } from "@/lib/auth/audit";

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

export async function GET() {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;
  try {
    const users = await prisma.adminUser.findMany({
      select: SAFE_SELECT,
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ users });
  } catch (e) {
    return handleRouteError("GET /api/admin/users", e);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;

  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;

  const parsed = createAdminUserSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  }

  const { email, password, role, displayName } = parsed.data;

  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: { email, passwordHash, role, displayName: displayName ?? null },
      select: SAFE_SELECT,
    });

    await writeAuditLog({
      action: "admin_user_created",
      userId: session!.user.id,
      email: session!.user.email,
      metadata: { targetUserId: user.id, targetEmail: email, role },
    });

    return apiSuccess({ user }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/users", e);
  }
}
