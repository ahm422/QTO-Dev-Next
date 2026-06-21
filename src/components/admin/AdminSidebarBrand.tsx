"use client"

import Link from "next/link"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { SiteLogo } from "@/components/common/SiteLogo"

export default function AdminSidebarBrand() {
  const { theme } = useAdminTheme()

  return (
    <Link
      href="/admin"
      className="relative flex items-center gap-3 h-16 px-5 border-b border-border shrink-0 overflow-hidden group"
      aria-label="QTO Dev Admin"
    >
      {/* Subtle gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      {/* Left accent bar */}
      <span className="relative shrink-0 h-7 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/30" />
      <SiteLogo
        forcedTheme={theme}
        height={32}
        width={110}
        className="relative h-8 w-auto object-contain"
        priority
      />
    </Link>
  )
}
