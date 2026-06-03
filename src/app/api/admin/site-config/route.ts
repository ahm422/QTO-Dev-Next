import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { siteConfigSchema } from "@/lib/validators/admin/siteConfig";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const items = await prisma.siteConfig.findMany({ orderBy: { key: "asc" } });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/site-config", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = siteConfigSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.siteConfig.upsert({
      where: { key: parsed.data.key },
      create: parsed.data,
      update: { value: parsed.data.value, label: parsed.data.label },
    });
    revalidatePath("/");
    return apiSuccess({ key: item.key }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/site-config", e);
  }
}
