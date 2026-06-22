"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems, GROUP_LABELS } from "@/config/admin-nav"
import { Button } from "@/components/ui/button"
import { ExternalLink, LogOut, ChevronRight, Sun, Moon, LayoutDashboard } from "lucide-react"
import AdminMobileNav from "@/components/admin/AdminMobileNav"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"

function useAdminHeaderContext() {
  const pathname = usePathname()

  const currentNavItem = adminNavItems.find((item) => {
    if (item.href === "/admin") return pathname === "/admin"
    return pathname.startsWith(item.href)
  })

  const crumbs: { label: string; href?: string }[] = []

  if (currentNavItem && currentNavItem.href !== "/admin") {
    crumbs.push({ label: currentNavItem.label, href: currentNavItem.href })
    if (pathname !== currentNavItem.href) {
      const tail = pathname.replace(currentNavItem.href, "").replace(/^\//, "")
      if (tail === "new") {
        crumbs.push({ label: `New ${currentNavItem.label.replace(/s$/, "")}` })
      } else if (tail) {
        crumbs.push({ label: "Edit" })
      }
    }
  }

  return { crumbs, currentNavItem }
}

interface AdminHeaderProps {
  userEmail?: string
  userRole?: string
}

export default function AdminHeader({ userEmail, userRole }: AdminHeaderProps) {
  const { crumbs, currentNavItem } = useAdminHeaderContext()
  const { theme, toggleAdminTheme } = useAdminTheme()

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 md:px-6 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] supports-[backdrop-filter]:bg-[var(--background)]/60">
      {/* Mobile menu trigger — left of breadcrumbs */}
      <div className="flex lg:hidden shrink-0">
        <AdminMobileNav userEmail={userEmail} userRole={userRole} />
      </div>

      {/* Breadcrumbs */}
      <nav className="flex-1 flex items-center gap-1 min-w-0" aria-label="Breadcrumb">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-sm">Admin</span>
        </Link>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <Fragment key={i}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className={`text-sm truncate ${isLast ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {crumb.label}
                </span>
              )}
            </Fragment>
          )
        })}
      </nav>

      {/* Section pill — desktop only, hidden on dashboard root */}
      {currentNavItem && currentNavItem.href !== "/admin" && (
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium ml-2 shrink-0">
          <currentNavItem.icon className="h-3 w-3" />
          {GROUP_LABELS[currentNavItem.group]}
        </div>
      )}

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAdminTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* View site — desktop */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hidden sm:flex gap-1.5 rounded-lg hover:border-primary hover:text-primary h-8"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
        </Button>

        {/* View site — mobile icon only */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="sm:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer" aria-label="View site">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>

        {/* Sign out — both variants in one form */}
        <form action="/admin/logout" method="post">
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="hidden sm:flex gap-1.5 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="submit"
            className="sm:hidden h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  )
}
