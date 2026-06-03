"use client"

import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import { Separator } from "@/components/ui/separator"

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-background border-r border-border z-40">
      <div className="flex items-center h-16 px-6 border-b border-border shrink-0">
        <span className="font-semibold text-foreground tracking-tight">QTO CMS</span>
      </div>

      <AdminNavList />

      <div className="p-3 border-t border-border shrink-0">
        <Separator className="mb-3" />
        <AdminNavLogout />
      </div>
    </aside>
  )
}
