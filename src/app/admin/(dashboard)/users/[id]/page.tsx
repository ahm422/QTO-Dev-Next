import { getServerSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader";
import AdminUserForm from "./AdminUserForm";

export default async function AdminUserFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (session?.user?.role !== "super_admin") redirect("/admin/unauthorized");

  const { id } = await params;

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="New Admin User"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Admin Users", href: "/admin/users" },
            { label: "New" },
          ]}
        />
        <AdminUserForm currentUserId={session!.user.id} />
      </div>
    );
  }

  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      displayName: true,
      isActive: true,
      lastLoginAt: true,
      lastLoginIp: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Admin User"
        subtitle={user.displayName ?? user.email}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Admin Users", href: "/admin/users" },
          { label: "Edit" },
        ]}
      />
      <AdminUserForm defaultValues={user} currentUserId={session!.user.id} />
    </div>
  );
}
