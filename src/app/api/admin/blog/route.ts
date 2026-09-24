import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { blogPostSchema } from "@/lib/validators/admin/blogPost";
import { revalidateBlogCaches } from "@/lib/revalidate";
import {
  blogPostWithTagsInclude,
  fromPrismaBlogPost,
  toPrismaBlogPostCreateData,
} from "@/lib/prisma/blogPostData";
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const isPublishedParam = searchParams.get("isPublished");
    const isPublished = isPublishedParam === "true" ? true : isPublishedParam === "false" ? false : undefined;
    const items = await prisma.blogPost.findMany({
      where: {
        ...(category !== undefined && { category }),
        ...(isPublished !== undefined && { isPublished }),
      },
      orderBy: { createdAt: "desc" },
      include: blogPostWithTagsInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaBlogPost) });
  } catch (e) {
    return handleRouteError("GET /api/admin/blog", e);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const publishedAt = parsed.data.publishedAt
      ? new Date(parsed.data.publishedAt)
      : parsed.data.isPublished
        ? new Date()
        : null;
    const item = await prisma.blogPost.create({
      data: {
        ...toPrismaBlogPostCreateData(parsed.data),
        publishedAt,
      },
      include: blogPostWithTagsInclude,
    });
    revalidateBlogCaches(item.slug);
    await writeContentAudit({
      session,
      action: item.isPublished ? AUDIT_ACTIONS.CONTENT_PUBLISHED : AUDIT_ACTIONS.CONTENT_CREATED,
      section: "blog",
      entityId: item.id,
      label: item.title,
    });
    triggerChatbotSync("blog_posts");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/blog", e);
  }
}
