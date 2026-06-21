import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { pageSectionPaths } from "@/lib/revalidate-paths";
import { z } from "zod";

const pageSectionSchema = z.object({
  slug: z.string().min(1),
  label: z.string().optional(),
  data: z.record(z.string(), z.unknown()),
  isPublished: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const items = await prisma.pageSection.findMany({
      where: page ? { slug: { startsWith: `${page}.` } } : undefined,
      orderBy: { slug: "asc" },
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/page-sections", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = pageSectionSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> });
  try {
    const item = await prisma.pageSection.create({ data: { ...parsed.data, data: parsed.data.data as never } });
    for (const p of pageSectionPaths(parsed.data.slug)) revalidatePath(p);
    return apiSuccess({ slug: item.slug }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/page-sections", e);
  }
}
