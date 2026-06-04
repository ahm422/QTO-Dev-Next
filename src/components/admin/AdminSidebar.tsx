import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import SidebarUserProfile from "@/components/admin/navigation/SidebarUserProfile"
import AdminSidebarBrand from "@/components/admin/AdminSidebarBrand"

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-[var(--sidebar)] border-r border-border z-40">
      {/* Brand */}
      <AdminSidebarBrand />

      {/* Navigation */}
      <AdminNavList />

      {/* Footer: user profile + logout */}
      <div className="border-t border-border shrink-0">
        <SidebarUserProfile />
        <div className="px-3 pb-3">
          <AdminNavLogout />
        </div>
      </div>
    </aside>
  )
}
