import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { employeeSchema } from "@/lib/validators/employees/employee";
import { createEmployeeRecord } from "@/lib/employees/createEmployee";
import { mapEmployeeUniqueConflict } from "@/lib/employees/uniqueConflict";
import type { Prisma } from "@prisma/client";

const EMPLOYEE_ROLES = ["super_admin", "hr"] as const;

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession({ allowedRoles: [...EMPLOYEE_ROLES] });
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const department = searchParams.get("department")?.trim();
  const status = searchParams.get("status")?.trim();

  const where: Prisma.EmployeeWhereInput = {
    ...(department ? { department } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { employeeCode: { contains: q } },
            { cnic: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
  };

  try {
    const items = await prisma.employee.findMany({ where, orderBy: { createdAt: "desc" } });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/employees", e);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({ allowedRoles: [...EMPLOYEE_ROLES] });
  if (error) return error;

  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = employeeSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });

  try {
    const employee = await createEmployeeRecord(parsed.data, {
      createdBy: session.user.id,
      suppressEmail: Boolean((body as Record<string, unknown>)?.suppressEmail),
    });
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_CREATED,
      section: "employees",
      entityId: employee.id,
      label: employee.employeeCode,
    });
    return apiSuccess({ id: employee.id }, 201);
  } catch (e) {
    return mapEmployeeUniqueConflict(e) ?? handleRouteError("POST /api/admin/employees", e);
  }
}
