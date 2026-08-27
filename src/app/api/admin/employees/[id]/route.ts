import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { employeeBaseSchema } from "@/lib/validators/employees/employee";
import { mapEmployeeUniqueConflict } from "@/lib/employees/uniqueConflict";

const EMPLOYEE_ROLES = ["super_admin", "hr"] as const;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession({ allowedRoles: [...EMPLOYEE_ROLES] });
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.employee.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/admin/employees/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: [...EMPLOYEE_ROLES] });
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  // Base schema only — Zod v4 forbids .partial() on refined schemas.
  const parsed = employeeBaseSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.employee.update({ where: { id }, data: parsed.data });
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "employees",
      entityId: item.id,
      label: item.employeeCode,
    });
    return apiSuccess({ item });
  } catch (e) {
    return mapEmployeeUniqueConflict(e) ?? handleRouteError("PATCH /api/admin/employees/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.employee.findUnique({ where: { id }, select: { employeeCode: true } });
    await prisma.employee.delete({ where: { id } });
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_DELETED,
      section: "employees",
      entityId: id,
      label: existing?.employeeCode,
    });
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/employees/[id]", e);
  }
}
