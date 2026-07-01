import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { fromPrismaJob } from "@/lib/prisma/jsonModelData";

export async function GET() {
  try {
    const items = await prisma.job.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ items: items.map(fromPrismaJob) });
  } catch (e) {
    return handleRouteError("GET /api/jobs", e);
  }
}
