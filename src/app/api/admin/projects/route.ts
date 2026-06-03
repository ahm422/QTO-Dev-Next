import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { projectSchema } from "@/lib/validators/admin/project";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await prisma.project.findMany({
      where: category !== undefined ? { category } : undefined,
      orderBy: { order: "asc" },
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/projects", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.project.create({ data: parsed.data });
    revalidatePath("/");
    revalidatePath("/projects");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/projects", e);
  }
}
