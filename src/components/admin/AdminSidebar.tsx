import AdminNavList from "@/components/admin/AdminNavList"
import SidebarUserMenu from "@/components/admin/navigation/SidebarUserMenu"
import AdminSidebarBrand from "@/components/admin/AdminSidebarBrand"

interface AdminSidebarProps {
  userRole: string
  userEmail: string
}

export default function AdminSidebar({ userRole, userEmail }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-[var(--sidebar)] border-r border-border z-40">
      {/* Brand */}
      <AdminSidebarBrand />

      {/* Navigation */}
      <AdminNavList userRole={userRole} />

      {/* Footer: user menu with profile dropdown */}
      <div className="border-t border-border shrink-0 p-2">
        <SidebarUserMenu email={userEmail} role={userRole} />
      </div>
    </aside>
  )
}
