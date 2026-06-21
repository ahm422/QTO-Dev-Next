import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { hashToken } from "@/lib/auth/crypto";
import { COOKIE_REFRESH_TOKEN } from "@/lib/auth/constants";
import { parseUserAgent } from "@/lib/auth/parseUserAgent";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";
import SessionsTable from "./SessionsTable";

export default async function SessionsPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const cookieStore = await cookies();
  const rawRt = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;

  let currentSessionId: string | null = null;
  if (rawRt) {
    const tokenHash = await hashToken(rawRt);
    const row = await prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true },
    });
    currentSessionId = row?.id ?? null;
  }

  const rawSessions = await prisma.refreshToken.findMany({
    where: {
      userId: session.user.id,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      ip: true,
      userAgent: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: { lastUsedAt: "desc" },
  });

  const sessions = rawSessions
    .map((s) => ({
      id: s.id,
      deviceLabel: parseUserAgent(s.userAgent),
      ip: s.ip ?? "Unknown",
      createdAt: s.createdAt.toISOString(),
      lastUsedAt: s.lastUsedAt.toISOString(),
      isCurrent: s.id === currentSessionId,
    }))
    .sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
    });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Active Sessions"
        subtitle="Devices and browsers signed into your account. Revoke any session you don't recognize."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Active Sessions" }]}
      />
      <SessionsTable sessions={sessions} />
    </div>
  );
}
