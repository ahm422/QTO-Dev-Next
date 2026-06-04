"use client"

import Link from "next/link"
import { useAdminTheme } from "@/components/admin/AdminThemeProvider"
import { SiteLogo } from "@/components/common/SiteLogo"

export default function AdminSidebarBrand() {
  const { theme } = useAdminTheme()

  return (
    <Link
      href="/admin"
      className="flex items-center h-16 px-6 border-b border-border shrink-0"
      aria-label="QTO Dev Admin"
    >
      <SiteLogo forcedTheme={theme} height={36} width={120} className="h-9 w-auto object-contain" priority />
    </Link>
  )
}
