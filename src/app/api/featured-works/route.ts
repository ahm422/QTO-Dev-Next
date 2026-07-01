import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { fromPrismaFeaturedWork } from "@/lib/prisma/jsonModelData";

export async function GET() {
  try {
    const items = await prisma.featuredWork.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
    return apiSuccess({ items: items.map(fromPrismaFeaturedWork) });
  } catch (e) {
    return handleRouteError("GET /api/featured-works", e);
  }
}
