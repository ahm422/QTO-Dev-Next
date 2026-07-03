import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { fromPrismaIndustry } from "@/lib/prisma/jsonModelData";

export async function GET() {
  try {
    const items = await prisma.industry.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });
    return apiSuccess({ items: items.map(fromPrismaIndustry) });
  } catch (e) {
    return handleRouteError("GET /api/industries", e);
  }
}
