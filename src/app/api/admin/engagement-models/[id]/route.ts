import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { engagementModelSchema } from "@/lib/validators/admin/engagementModel";
import {
  fromPrismaEngagementModel,
  toPartialPrismaEngagementModelData,
} from "@/lib/prisma/jsonModelData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.engagementModel.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaEngagementModel(item) });
  } catch (e) {
    return handleRouteError("GET /api/admin/engagement-models/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = engagementModelSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.engagementModel.update({
      where: { id },
      data: toPartialPrismaEngagementModelData(parsed.data),
    });
    revalidatePath("/");
    return apiSuccess({ item: fromPrismaEngagementModel(item) });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/engagement-models/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    await prisma.engagementModel.delete({ where: { id } });
    revalidatePath("/");
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/engagement-models/[id]", e);
  }
}
