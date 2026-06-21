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
  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }

  const userEmail = session?.user?.email ?? ""
  const userRole = session?.user?.role ?? "admin"

  return (
    <AdminThemeProvider>
      <AdminSidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader userEmail={userEmail} userRole={userRole} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </AdminThemeProvider>
  )
}
