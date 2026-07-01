import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider"
import MaintenanceBanner from "@/components/common/MaintenanceBanner"
import { isWriteFrozen } from "@/lib/freeze-writes"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const role = session?.user?.role ?? ""
  if (!["super_admin", "admin", "editor"].includes(role)) {
    redirect("/admin/unauthorized")
  }

  const currentUser = session
    ? await prisma.adminUser.findUnique({
        where: { id: session.user.id },
        select: { email: true, displayName: true },
      })
    : null

  const userEmail = currentUser?.email ?? ""
  const displayName = currentUser?.displayName ?? null
  const userRole = role

  return (
    <AdminThemeProvider>
      {isWriteFrozen() && <MaintenanceBanner />}
      <AdminSidebar userRole={userRole} userEmail={userEmail} displayName={displayName} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader userEmail={userEmail} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </AdminThemeProvider>
  )
}
