import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { fromPrismaEngagementModel } from "@/lib/prisma/jsonModelData";

export async function GET() {
  try {
    const items = await prisma.engagementModel.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
    return apiSuccess({ items: items.map(fromPrismaEngagementModel) });
  } catch (e) {
    return handleRouteError("GET /api/engagement-models", e);
  }
}
