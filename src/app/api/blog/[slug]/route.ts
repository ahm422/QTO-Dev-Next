import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const item = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/blog/[slug]", e);
  }
}
