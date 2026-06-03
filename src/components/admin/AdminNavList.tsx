"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { adminNavItems } from "@/config/admin-nav"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AdminNavListProps {
  onNavigate?: () => void
  className?: string
}

export default function AdminNavList({ onNavigate, className }: AdminNavListProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <nav className={cn("flex-1 overflow-y-auto py-4 px-3", className)}>
      <ul className="space-y-0.5">
        {adminNavItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
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
  )
}

export function AdminNavLogout() {
  return (
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
  )
}
