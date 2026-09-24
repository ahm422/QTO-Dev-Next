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
  toPrismaBlogPostPartialUpdateData,
  toPrismaBlogPostUpdateData,
} from "@/lib/prisma/blogPostData";
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.blogPost.findUnique({
      where: { id },
      include: blogPostWithTagsInclude,
    });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaBlogPost(item) });
  } catch (e) {
    return handleRouteError("GET /api/admin/blog/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
    const publishedAt = parsed.data.publishedAt
      ? new Date(parsed.data.publishedAt)
      : parsed.data.isPublished && !existing?.publishedAt
        ? new Date()
        : existing?.publishedAt ?? null;
    const updateData =
      Object.keys(parsed.data).length === Object.keys(blogPostSchema.shape).length
        ? toPrismaBlogPostUpdateData(parsed.data as Parameters<typeof toPrismaBlogPostUpdateData>[0])
        : toPrismaBlogPostPartialUpdateData(parsed.data);
    const item = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        ...(parsed.data.isPublished !== undefined || parsed.data.publishedAt !== undefined
          ? { publishedAt }
          : {}),
      },
      include: blogPostWithTagsInclude,
    });
    revalidateBlogCaches(item.slug);
    const justPublished = item.isPublished && !existing?.publishedAt;
    await writeContentAudit({
      session,
      action: justPublished ? AUDIT_ACTIONS.CONTENT_PUBLISHED : AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "blog",
      entityId: item.id,
      label: item.title,
    });
    triggerChatbotSync("blog_posts");
    return apiSuccess({ item: fromPrismaBlogPost(item) });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/blog/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true, title: true } });
    await prisma.blogPost.delete({ where: { id } });
    revalidateBlogCaches(existing?.slug);
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_DELETED,
      section: "blog",
      entityId: id,
      label: existing?.title,
    });
    triggerChatbotSync("blog_posts");
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/blog/[id]", e);
  }
}
