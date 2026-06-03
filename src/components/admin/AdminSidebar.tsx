import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import SidebarUserProfile from "@/components/admin/navigation/SidebarUserProfile"

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-[var(--sidebar)] border-r border-border z-40">
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-border shrink-0 gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary-foreground leading-none">Q</span>
        </div>
        <span className="font-semibold text-foreground tracking-tight">QTO CMS</span>
      </div>

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
