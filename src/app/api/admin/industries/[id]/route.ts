import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { industrySchema } from "@/lib/validators/admin/industry";
import { fromPrismaIndustry, toPartialPrismaIndustryData } from "@/lib/prisma/jsonModelData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.industry.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaIndustry(item) });
  } catch (e) {
    return handleRouteError("GET /api/admin/industries/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = industrySchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.industry.update({
      where: { id },
      data: toPartialPrismaIndustryData(parsed.data),
    });
    revalidatePath("/");
    revalidatePath("/industries");
    if (item.slug) revalidatePath(`/industries/${item.slug}`);
    return apiSuccess({ item: fromPrismaIndustry(item) });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/industries/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.industry.findUnique({ where: { id }, select: { slug: true } });
    await prisma.industry.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/industries");
    if (existing?.slug) revalidatePath(`/industries/${existing.slug}`);
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/industries/[id]", e);
  }
}
