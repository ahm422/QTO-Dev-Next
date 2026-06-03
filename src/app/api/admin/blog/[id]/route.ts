import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { blogPostSchema } from "@/lib/validators/admin/blogPost";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.blogPost.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/admin/blog/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
    const publishedAt =
      parsed.data.isPublished && !existing?.publishedAt
        ? new Date()
        : existing?.publishedAt ?? null;
    const item = await prisma.blogPost.update({
      where: { id },
      data: { ...parsed.data, publishedAt },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    if (item.slug) revalidatePath(`/blog/${item.slug}`);
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/blog/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/blog");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/blog/[id]", e);
  }
}
