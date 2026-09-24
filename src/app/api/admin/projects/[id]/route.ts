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
import { projectSchema } from "@/lib/validators/admin/project";
import {
  fromPrismaProject,
  projectWithRelationsInclude,
  toPrismaProjectPartialUpdateData,
  toPrismaProjectUpdateData,
} from "@/lib/prisma/projectData";
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.project.findUnique({
      where: { id },
      include: projectWithRelationsInclude,
    });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaProject(item) });
  } catch (e) {
    return handleRouteError("GET /api/admin/projects/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const updateData =
      Object.keys(parsed.data).length === Object.keys(projectSchema.shape).length
        ? toPrismaProjectUpdateData(parsed.data as Parameters<typeof toPrismaProjectUpdateData>[0])
        : toPrismaProjectPartialUpdateData(parsed.data);
    const item = await prisma.project.update({
      where: { id },
      data: updateData,
      include: projectWithRelationsInclude,
    });
    revalidatePath("/");
    revalidatePath("/projects");
    if (item.slug) revalidatePath(`/projects/${item.slug}`);
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "projects",
      entityId: item.id,
      label: item.title,
    });
    triggerChatbotSync("projects");
    return apiSuccess({ item: fromPrismaProject(item) });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/projects/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.project.findUnique({ where: { id }, select: { slug: true, title: true } });
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/projects");
    if (existing?.slug) revalidatePath(`/projects/${existing.slug}`);
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_DELETED,
      section: "projects",
      entityId: id,
      label: existing?.title,
    });
    triggerChatbotSync("projects");
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/projects/[id]", e);
  }
}
