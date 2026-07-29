import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { writeContentAudit } from "@/lib/auth/audit";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { productSchema } from "@/lib/validators/admin/product";
import { revalidateProductsCaches } from "@/lib/revalidate";
import {
  fromPrismaProduct,
  productWithFeaturesInclude,
  toPrismaProductPartialUpdateData,
  toPrismaProductUpdateData,
} from "@/lib/prisma/productData";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  try {
    const item = await prisma.product.findUnique({
      where: { id },
      include: productWithFeaturesInclude,
    });
    if (!item) return apiError(404, "Not found");
    return apiSuccess({ item: fromPrismaProduct(item) });
  } catch (e) {
    return handleRouteError("GET /api/admin/products/[id]", e);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdminSession();
  if (error) return error;
  const { id } = await params;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", {
      fieldErrors: formatZodFieldErrors(parsed.error),
    });
  try {
    const updateData =
      Object.keys(parsed.data).length === Object.keys(productSchema.shape).length
        ? toPrismaProductUpdateData(
            parsed.data as Parameters<typeof toPrismaProductUpdateData>[0]
          )
        : toPrismaProductPartialUpdateData(parsed.data);
    const item = await prisma.product.update({
      where: { id },
      data: updateData,
      include: productWithFeaturesInclude,
    });
    revalidateProductsCaches();
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_UPDATED,
      section: "products",
      entityId: item.id,
      label: item.title,
    });
    return apiSuccess({ item: fromPrismaProduct(item) });
  } catch (e) {
    return handleRouteError("PATCH /api/admin/products/[id]", e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdminSession({
    allowedRoles: ["super_admin", "admin"],
  });
  if (error) return error;
  const { id } = await params;
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { title: true },
    });
    await prisma.product.delete({ where: { id } });
    revalidateProductsCaches();
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_DELETED,
      section: "products",
      entityId: id,
      label: existing?.title,
    });
    return apiSuccess({ id });
  } catch (e) {
    return handleRouteError("DELETE /api/admin/products/[id]", e);
  }
}
