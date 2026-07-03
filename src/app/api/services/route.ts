import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { fromPrismaService, serviceWithTagsInclude } from "@/lib/prisma/serviceData";

export async function GET() {
  try {
    const items = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: serviceWithTagsInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaService) });
  } catch (e) {
    return handleRouteError("GET /api/services", e);
  }
}
