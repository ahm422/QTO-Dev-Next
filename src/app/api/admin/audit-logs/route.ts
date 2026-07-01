import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseMetadata } from "@/lib/metadata";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { apiSuccess } from "@/lib/apiResponses";
import { auditLogQuerySchema } from "@/lib/validators/admin/auditLog";
import { buildAuditLogWhere } from "@/lib/auth/auditQuery";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin"] });
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = auditLogQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return apiSuccess({ items: [], pagination: { page: 1, pageSize: 50, total: 0, totalPages: 0 } });
    }

    const query = parsed.data;
    const where = buildAuditLogWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.pageSize,
        include: {
          user: { select: { id: true, email: true, displayName: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return apiSuccess({
      items: items.map((item) => ({
        ...item,
        metadata: parseMetadata(item.metadata),
      })),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    });
  } catch (e) {
    return handleRouteError("GET /api/admin/audit-logs", e);
  }
}
