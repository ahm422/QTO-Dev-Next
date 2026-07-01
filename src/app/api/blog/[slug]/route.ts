import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { blogPostWithTagsInclude, fromPrismaBlogPost } from "@/lib/prisma/blogPostData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const item = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
      include: blogPostWithTagsInclude,
    });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaBlogPost(item) });
  } catch (e) {
    return handleRouteError("GET /api/blog/[slug]", e);
  }
}
