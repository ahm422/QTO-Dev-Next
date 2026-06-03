"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { adminNavItems } from "@/config/admin-nav"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-background border-r border-border z-40">
      <div className="flex items-center h-16 px-6 border-b border-border shrink-0">
        <span className="font-semibold text-foreground tracking-tight">QTO CMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {adminNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-border shrink-0">
        <Separator className="mb-3" />
        <form action="/admin/logout" method="post">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  )
}
