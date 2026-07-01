import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { parseMetadata } from "@/lib/metadata";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";
import StatCard from "@/components/admin/data/StatCard";
import StatCardGrid from "@/components/admin/data/StatCardGrid";
import FilterBar from "@/components/admin/data/FilterBar";
import AdminPagination from "@/components/admin/data/AdminPagination";
import DateRangeFilter from "@/components/admin/data/DateRangeFilter";
import AuditLogTable from "./Table";
import { auditLogQuerySchema } from "@/lib/validators/admin/auditLog";
import { buildAuditLogWhere } from "@/lib/auth/auditQuery";
import { AUDIT_ACTIONS } from "@/lib/auth/auditActions";
import { ScrollText, ShieldAlert, Shield } from "lucide-react";

const PAGE_SIZE = 50;

const ACTION_OPTIONS = Object.values(AUDIT_ACTIONS).map((a) => ({ label: a, value: a }));

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await getServerSession();
  if (session?.user?.role !== "super_admin") redirect("/admin/unauthorized");

  const params = await searchParams;
  const parsed = auditLogQuerySchema.safeParse({ ...params, pageSize: PAGE_SIZE });
  const query = parsed.success ? parsed.data : { page: 1, pageSize: PAGE_SIZE };

  const where = buildAuditLogWhere(query);
  const skip = (query.page - 1) * query.pageSize;

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [rawRows, total, failedLogins24h, adminActions7d] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.pageSize,
      include: { user: { select: { id: true, email: true, displayName: true } } },
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.count({
      where: { action: AUDIT_ACTIONS.LOGIN_FAILED, createdAt: { gte: last24h } },
    }),
    prisma.auditLog.count({
      where: {
        action: { in: [AUDIT_ACTIONS.ADMIN_CREATED, AUDIT_ACTIONS.ADMIN_ROLE_CHANGED, AUDIT_ACTIONS.ADMIN_DEACTIVATED, AUDIT_ACTIONS.ADMIN_USER_FORCE_LOGOUT] },
        createdAt: { gte: last7d },
      },
    }),
  ]);

  const rows = rawRows.map((row) => ({
    ...row,
    metadata: parseMetadata(row.metadata),
  }));

  const totalPages = Math.ceil(total / query.pageSize);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Authentication and admin event trail"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Audit Log" }]}
        badges={[{ label: "super_admin only", variant: "warning" }]}
      />

      <StatCardGrid cols={3}>
        <StatCard label="Total events (filtered)" value={total.toLocaleString()} icon={ScrollText} iconColor="primary" />
        <StatCard label="Failed logins (24h)" value={failedLogins24h} icon={ShieldAlert} iconColor="warning" badgeVariant="warning" />
        <StatCard label="Admin actions (7d)" value={adminActions7d} icon={Shield} iconColor="blue" />
      </StatCardGrid>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
        <FilterBar
          searchPlaceholder="Search by email…"
          filters={[
            {
              key: "action",
              placeholder: "All actions",
              options: ACTION_OPTIONS,
            },
          ]}
          className="flex-1"
        />
        <DateRangeFilter />
      </div>

      <AuditLogTable rows={rows} />

      <AdminPagination
        page={query.page}
        pageSize={query.pageSize}
        total={total}
        totalPages={totalPages}
      />
    </div>
  );
}
