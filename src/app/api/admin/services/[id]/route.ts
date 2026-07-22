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
  toPrismaServicePartialUpdateData,
  toPrismaServiceUpdateData,
} from "@/lib/prisma/serviceData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.service.findUnique({
      where: { id },
      include: serviceWithTagsInclude,
    });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaService(item) });
  } catch (e) {
    return handleRouteError("GET /api/admin/services/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const updateData =
      Object.keys(parsed.data).length === Object.keys(serviceSchema.shape).length
        ? toPrismaServiceUpdateData(parsed.data as Parameters<typeof toPrismaServiceUpdateData>[0])
        : toPrismaServicePartialUpdateData(parsed.data);
    const item = await prisma.service.update({
      where: { id },
      data: updateData,
      include: serviceWithTagsInclude,
    });
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/sitemap.xml");
    if (item.slug) revalidatePath(`/services/${item.slug}`);
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "services",
      entityId: item.id,
      label: item.title,
    });
    return apiSuccess({ item: fromPrismaService(item) });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/services/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.service.findUnique({ where: { id }, select: { slug: true, title: true } });
    await prisma.service.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/sitemap.xml");
    if (existing?.slug) revalidatePath(`/services/${existing.slug}`);
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_DELETED,
      section: "services",
      entityId: id,
      label: existing?.title,
    });
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/services/[id]", e);
  }
}
