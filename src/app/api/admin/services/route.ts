import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { serviceSchema } from "@/lib/validators/admin/service";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const items = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/services", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.service.create({ data: parsed.data });
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/sitemap.xml");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/services", e);
  }
}
