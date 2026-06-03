import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";

export async function GET() {
  try {
    const items = await prisma.workValue.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/work-values", e);
  }
}
