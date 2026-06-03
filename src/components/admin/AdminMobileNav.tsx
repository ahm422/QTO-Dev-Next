"use client"

import { useState } from "react"
import AdminNavList, { AdminNavLogout } from "@/components/admin/AdminNavList"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Menu } from "lucide-react"

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col">
        <SheetHeader className="px-6 h-16 flex flex-row items-center border-b border-border shrink-0">
          <SheetTitle className="font-semibold tracking-tight">QTO CMS</SheetTitle>
        </SheetHeader>
        <AdminNavList onNavigate={() => setOpen(false)} />
        <div className="p-3 border-t border-border shrink-0">
          <Separator className="mb-3" />
          <AdminNavLogout />
        </div>
      </SheetContent>
    </Sheet>
  )
}
