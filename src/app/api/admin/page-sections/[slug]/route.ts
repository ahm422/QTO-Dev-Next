import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseMetadata, stringifyMetadata } from "@/lib/metadata";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { pageSectionPaths } from "@/lib/revalidate-paths";
import { z } from "zod";

const updateSchema = z.object({
  label: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { slug } = await params;
  try {
    const item = await prisma.pageSection.findUnique({ where: { slug } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({
      item: {
        ...item,
        data: parseMetadata(item.data) ?? {},
      },
    });
  } catch (e) {
    return handleRouteError("GET /api/admin/page-sections/[slug]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { slug } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> });
  try {
    const updateData =
      parsed.data.data !== undefined
        ? {
            ...parsed.data,
            data: stringifyMetadata(parsed.data.data) ?? "{}",
          }
        : parsed.data;
    const item = await prisma.pageSection.update({ where: { slug }, data: updateData });
    for (const p of pageSectionPaths(slug)) revalidatePath(p);
    return apiSuccess({
      item: {
        ...item,
        data: parseMetadata(item.data) ?? {},
      },
    });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/page-sections/[slug]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { slug } = await params;
  try {
    await prisma.pageSection.delete({ where: { slug } });
    for (const p of pageSectionPaths(slug)) revalidatePath(p);
    return apiSuccess({ slug });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/page-sections/[slug]", e);
  }
}
