import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { blogPostWithTagsInclude, fromPrismaBlogPost } from "@/lib/prisma/blogPostData";

export async function GET() {
  try {
    const items = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: blogPostWithTagsInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaBlogPost) });
  } catch (e) {
    return handleRouteError("GET /api/blog", e);
  }
}
