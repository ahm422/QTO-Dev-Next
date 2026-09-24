import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { projectSchema } from "@/lib/validators/admin/project";
import { revalidateProjectCaches } from "@/lib/revalidate";
import {
  fromPrismaProject,
  projectWithRelationsInclude,
  toPrismaProjectCreateData,
} from "@/lib/prisma/projectData";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await prisma.project.findMany({
      where: category !== undefined ? { category } : undefined,
      orderBy: { order: "asc" },
      include: projectWithRelationsInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaProject) });
  } catch (e) {
    return handleRouteError("GET /api/admin/projects", e);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.project.create({
      data: toPrismaProjectCreateData(parsed.data),
      include: projectWithRelationsInclude,
    });
    revalidateProjectCaches(item.slug, item.serviceSlug);
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_CREATED,
      section: "projects",
      entityId: item.id,
      label: item.title,
    });
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/projects", e);
  }
}
