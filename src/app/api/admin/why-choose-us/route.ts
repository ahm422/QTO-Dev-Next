import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { whyChooseUsSchema } from "@/lib/validators/admin/whyChooseUs";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    const items = await prisma.whyChooseUs.findMany({
      where: context ? { context } : undefined,
      orderBy: { order: "asc" },
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/why-choose-us", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = whyChooseUsSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.whyChooseUs.create({ data: parsed.data });
    revalidatePath("/");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/why-choose-us", e);
  }
}
