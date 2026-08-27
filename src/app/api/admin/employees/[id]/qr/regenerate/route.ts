import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { generateEmployeeQr } from "@/lib/employees/qr";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "hr"] });
  if (error) return error;
  const { id } = await params;

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: { id: true, publicId: true, name: true },
    });
    if (!employee) return apiError(404, "Not found");

    const { qrKey } = await generateEmployeeQr(employee.id, employee.publicId);
    if (!qrKey) return apiError(502, "QR generation failed");

    await prisma.employee.update({ where: { id }, data: { qrKey } });
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "employees",
      entityId: employee.id,
      label: employee.name,
    });

    return apiSuccess({ qrKey });
  } catch (e) {
    return handleRouteError("POST /api/admin/employees/[id]/qr/regenerate", e);
  }
}
