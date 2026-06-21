"use client"

import { usePathname } from "next/navigation"
import { adminNavItems, GROUP_LABELS, type AdminNavGroup } from "@/config/admin-nav"
import SidebarNavGroup from "@/components/admin/navigation/SidebarNavGroup"
import SidebarNavItem from "@/components/admin/navigation/SidebarNavItem"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AdminNavListProps {
  onNavigate?: () => void
  className?: string
  userRole?: string
}

const GROUP_ORDER: AdminNavGroup[] = ["main", "content", "settings"]

export default function AdminNavList({ onNavigate, userRole }: AdminNavListProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: adminNavItems.filter(
      (item) =>
        item.group === group &&
        (!item.requiredRole || (userRole ? item.requiredRole.includes(userRole) : false))
    ),
  }))

  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2.5 scrollbar-none">
      {grouped.map(({ group, items }, i) =>
        items.length === 0 ? null : (
          <SidebarNavGroup key={group} label={GROUP_LABELS[group]} isFirst={i === 0}>
            {items.map((item) => (
              <SidebarNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                isActive={isActive(item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </SidebarNavGroup>
        )
      )}
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
