import AdminNavList from "@/components/admin/AdminNavList"
import SidebarUserMenu from "@/components/admin/navigation/SidebarUserMenu"
import AdminSidebarBrand from "@/components/admin/AdminSidebarBrand"

interface AdminSidebarProps {
  userRole: string
  userEmail: string
  displayName?: string | null
}

export default function AdminSidebar({ userRole, userEmail, displayName }: AdminSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-[var(--sidebar)] border-r border-border z-40 overflow-hidden">
      {/* Decorative ambient glow — top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/8 blur-3xl"
      />

      {/* Brand */}
      <AdminSidebarBrand />

      {/* Navigation */}
      <AdminNavList userRole={userRole} />

      {/* Footer: profile dropdown */}
      <div className="relative shrink-0 border-t border-border/60 bg-gradient-to-t from-primary/5 to-transparent p-2">
        <SidebarUserMenu email={userEmail} role={userRole} displayName={displayName} />
      </div>
    </aside>
  )
}
