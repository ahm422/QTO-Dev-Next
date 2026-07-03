import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { featuredWorkSchema } from "@/lib/validators/admin/featuredWork";
import {
  fromPrismaFeaturedWork,
  toPartialPrismaFeaturedWorkData,
  toPrismaFeaturedWorkData,
} from "@/lib/prisma/jsonModelData";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const items = await prisma.featuredWork.findMany({ orderBy: { order: "asc" } });
    return apiSuccess({ items: items.map(fromPrismaFeaturedWork) });
  } catch (e) {
    return handleRouteError("GET /api/admin/featured-works", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = featuredWorkSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.featuredWork.create({ data: toPrismaFeaturedWorkData(parsed.data) });
    revalidatePath("/");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/featured-works", e);
  }
}
