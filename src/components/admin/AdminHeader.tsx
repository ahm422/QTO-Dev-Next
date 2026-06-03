"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems } from "@/config/admin-nav"
import { Button } from "@/components/ui/button"
import { ExternalLink, LogOut, ChevronRight } from "lucide-react"
import AdminMobileNav from "@/components/admin/AdminMobileNav"

function useAdminBreadcrumbs() {
  const pathname = usePathname()
  const crumbs: { label: string; href?: string }[] = [{ label: "Admin", href: "/admin" }]

  const current = adminNavItems.find((item) => {
    if (item.href === "/admin") return false
    return pathname.startsWith(item.href)
  })

  if (current) {
    crumbs.push({ label: current.label, href: current.href })
    // Detail / new page
    if (pathname !== current.href) {
      const tail = pathname.replace(current.href, "").replace(/^\//, "")
      if (tail === "new") {
        crumbs.push({ label: `New ${current.label.replace(/s$/, "")}` })
      } else if (tail) {
        crumbs.push({ label: "Edit" })
      }
    }
  }

  return crumbs
}

export default function AdminHeader() {
  const breadcrumbs = useAdminBreadcrumbs()
  const isRoot = breadcrumbs.length === 1

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      <AdminMobileNav />

      {/* Breadcrumbs */}
      <nav className="flex-1 flex items-center gap-1 min-w-0" aria-label="Breadcrumb">
        {isRoot ? (
          <span className="text-sm font-semibold text-foreground">Dashboard</span>
        ) : (
          breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <span key={i} className="flex items-center gap-1 min-w-0">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`text-sm truncate ${isLast ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {crumb.label}
                  </span>
                )}
              </span>
            )
          })
        )}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2.5">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-xs">View site</span>
          </Link>
        </Button>

        <form action="/admin/logout" method="post">
          <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2.5">
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
