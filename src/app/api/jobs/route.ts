import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";

export async function GET() {
  try {
    const items = await prisma.job.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/jobs", e);
  }
}
