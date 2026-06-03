import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { siteConfigSchema } from "@/lib/validators/admin/siteConfig";

// [id] here is the config key (SiteConfig uses key as @id, not UUID)

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id: key } = await params;
  try {
    const item = await prisma.siteConfig.findUnique({ where: { key } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/admin/site-config/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id: key } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = siteConfigSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.siteConfig.update({ where: { key }, data: parsed.data });
    revalidatePath("/");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/site-config/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id: key } = await params;
  try {
    await prisma.siteConfig.delete({ where: { key } });
    revalidatePath("/");
    return apiSuccess({ key });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/site-config/[id]", e);
  }
}
