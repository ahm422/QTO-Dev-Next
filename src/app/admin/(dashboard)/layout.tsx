import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider"

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

  const userEmail = session?.user?.email ?? ""
  const userRole = role

  return (
    <AdminThemeProvider>
      <AdminSidebar userRole={userRole} userEmail={userEmail} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader userEmail={userEmail} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </AdminThemeProvider>
  )
}
