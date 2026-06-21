import type { Prisma } from "@prisma/client";
import type { AuditLogQuery } from "@/lib/validators/admin/auditLog";

export function buildAuditLogWhere(query: AuditLogQuery): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};

  if (query.action && query.action !== "all") {
    where.action = query.action;
  }

  if (query.userId) {
    where.userId = query.userId;
  }

  const emailSearch = query.q ?? query.email;
  if (emailSearch) {
    where.email = { contains: emailSearch, mode: "insensitive" };
  }

  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) {
      where.createdAt.gte = new Date(query.from);
    }
    if (query.to) {
      const toDate = new Date(query.to);
      toDate.setUTCHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  return where;
}
