import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { serviceSchema } from "@/lib/validators/admin/service";
import {
  fromPrismaService,
  serviceWithTagsInclude,
  toPrismaServiceCreateData,
} from "@/lib/prisma/serviceData";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const items = await prisma.service.findMany({
      orderBy: { order: "asc" },
      include: serviceWithTagsInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaService) });
  } catch (e) {
    return handleRouteError("GET /api/admin/services", e);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.service.create({
      data: toPrismaServiceCreateData(parsed.data),
      include: serviceWithTagsInclude,
    });
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/sitemap.xml");
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_CREATED,
      section: "services",
      entityId: item.id,
      label: item.title,
    });
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/services", e);
  }
}
