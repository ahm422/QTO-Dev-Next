"use client"

import { useState } from "react"
import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="admin-dark w-64 p-0 flex flex-col bg-[var(--sidebar)] border-r border-border">
        <SheetHeader className="px-6 h-14 flex flex-row items-center border-b border-border shrink-0 gap-2.5">
          <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary-foreground leading-none">Q</span>
          </div>
          <SheetTitle className="font-semibold tracking-tight text-foreground">QTO CMS</SheetTitle>
        </SheetHeader>
        <AdminNavList onNavigate={() => setOpen(false)} />
        <div className="border-t border-border px-3 py-3 shrink-0">
          <AdminNavLogout />
        </div>
      </SheetContent>
    </Sheet>
  )
}
