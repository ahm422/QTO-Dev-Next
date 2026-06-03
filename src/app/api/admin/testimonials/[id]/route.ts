import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { testimonialSchema } from "@/lib/validators/admin/testimonial";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.testimonial.findUnique({ where: { id } });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("GET /api/admin/testimonials/[id]", e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.testimonial.update({ where: { id }, data: parsed.data });
    revalidatePath("/");
    return apiSuccess({ item });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/testimonials/[id]", e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/testimonials/[id]", e);
  }
}
