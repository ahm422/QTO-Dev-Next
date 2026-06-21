"use client"

import { useState } from "react"
import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu } from "lucide-react"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { SiteLogo } from "@/components/common/SiteLogo"

interface AdminMobileNavProps {
  userEmail?: string
  userRole?: string
}

export default function AdminMobileNav({ userEmail = "", userRole = "admin" }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false)
  const { theme } = useAdminTheme()
  const themeClass = theme === "dark" ? "admin-dark" : "admin-light"
  const initials = userEmail.slice(0, 2).toUpperCase()

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
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground leading-none">{userEmail}</p>
              <p className="truncate text-xs text-muted-foreground mt-0.5 capitalize">{userRole}</p>
            </div>
          </div>
          <div className="px-3 pb-3">
            <AdminNavLogout />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
