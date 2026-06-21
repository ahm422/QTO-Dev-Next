import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";
import UsersTable from "./Table";

export default async function AdminUsersPage() {
  const session = await getServerSession();
  if (session?.user?.role !== "super_admin") redirect("/admin/unauthorized");

  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      displayName: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Users"
        subtitle="Manage admin accounts and roles"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Admin Users" }]}
        primaryAction={{ label: "+ Add User", href: "/admin/users/new" }}
      />
      <UsersTable rows={users} currentUserId={session!.user.id} />
    </div>
  );
}
