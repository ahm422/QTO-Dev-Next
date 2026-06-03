import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";

export async function GET() {
  try {
    const items = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/blog", e);
  }
}
