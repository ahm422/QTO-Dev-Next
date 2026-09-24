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
  toPrismaProductCreateData,
} from "@/lib/prisma/productData";
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const items = await prisma.product.findMany({
      orderBy: { order: "asc" },
      include: productWithFeaturesInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaProduct) });
  } catch (e) {
    return handleRouteError("GET /api/admin/products", e);
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdminSession({
    allowedRoles: ["super_admin", "admin"],
  });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = productSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", {
      fieldErrors: formatZodFieldErrors(parsed.error),
    });
  try {
    const item = await prisma.product.create({
      data: toPrismaProductCreateData(parsed.data),
      include: productWithFeaturesInclude,
    });
    revalidateProductsCaches();
    await writeContentAudit({
      session,
      action: AUDIT_ACTIONS.CONTENT_CREATED,
      section: "products",
      entityId: item.id,
      label: item.title,
    });
    triggerChatbotSync("products");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/products", e);
  }
}
