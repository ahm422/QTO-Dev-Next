"use client"

import { useState } from "react"
import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { SiteLogo } from "@/components/common/SiteLogo"
import SidebarUserProfile from "@/components/admin/navigation/SidebarUserProfile"

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const { theme } = useAdminTheme()
  const themeClass = theme === "dark" ? "admin-dark" : "admin-light"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={`${themeClass} w-64 p-0 flex flex-col bg-[var(--sidebar)] border-r border-border`}>
        <SheetHeader className="px-6 h-14 flex flex-row items-center border-b border-border shrink-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SiteLogo forcedTheme={theme} height={28} width={100} className="h-7 w-auto object-contain" priority />
        </SheetHeader>
        <AdminNavList onNavigate={() => setOpen(false)} />
        <div className="border-t border-border shrink-0">
          <SidebarUserProfile />
          <div className="px-3 pb-3">
            <AdminNavLogout />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
