"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface SidebarNavItemProps {
  label: string
  href: string
  icon: LucideIcon
  isActive: boolean
  onNavigate?: () => void
}

export default function SidebarNavItem({ label, href, icon: Icon, isActive, onNavigate }: SidebarNavItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
        )}
      >
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "bg-primary/20 text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
              : "text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
          )}
        >
          <Icon className="h-[15px] w-[15px]" />
        </span>
        <span className="truncate leading-none">{label}</span>
        {isActive && (
          <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        )}
      </Link>
    </li>
  )
}
