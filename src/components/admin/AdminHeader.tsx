"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems } from "@/config/admin-nav"
import { Button } from "@/components/ui/button"
import { ExternalLink, LogOut } from "lucide-react"
import AdminMobileNav from "@/components/admin/AdminMobileNav"

export default function AdminHeader() {
  const pathname = usePathname()

  const current = adminNavItems.find((item) => {
    if (item.href === "/admin") return pathname === "/admin"
    return pathname.startsWith(item.href)
  })

  const title = current?.label ?? "Admin"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
      <AdminMobileNav />

      <h1 className="flex-1 text-base font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </Button>

        <form action="/admin/logout" method="post">
          <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
