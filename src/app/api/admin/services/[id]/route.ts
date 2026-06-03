import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { serviceSchema } from "@/lib/validators/admin/service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.service.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/admin/services/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.service.update({ where: { id }, data: parsed.data });
    revalidatePath("/");
    revalidatePath("/services");
    if (item.slug) revalidatePath(`/services/${item.slug}`);
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/services/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.service.findUnique({ where: { id }, select: { slug: true } });
    await prisma.service.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/services");
    if (existing?.slug) revalidatePath(`/services/${existing.slug}`);
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/services/[id]", e);
  }
}
