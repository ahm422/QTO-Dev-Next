"use client";

import Link from "next/link";
import { Monitor, LogOut, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleBadge from "@/components/admin/data/RoleBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarUserMenuProps {
  email: string;
  role: string;
  displayName?: string | null;
}

export default function SidebarUserMenu({ email, role, displayName }: SidebarUserMenuProps) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-auto p-2.5 rounded-xl hover:bg-[var(--accent)] flex items-center gap-3 group"
        >
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[var(--sidebar)]" />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-medium truncate">{email}</p>
            <RoleBadge role={role} size="xs" />
          </div>

          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-64 p-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/20"
      >
        <div className="px-3 py-3 rounded-lg bg-[var(--muted)] mb-1.5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{displayName ?? email}</p>
            <p className="text-[11px] text-muted-foreground truncate">{email}</p>
            <RoleBadge role={role} size="xs" className="mt-0.5" />
          </div>
        </div>

        <DropdownMenuItem asChild className="rounded-lg h-9 cursor-pointer text-sm gap-2.5 px-3 hover:bg-[var(--accent)] focus:bg-[var(--accent)] transition-colors">
          <Link href="/admin/account/sessions" className="flex items-center gap-2.5">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            Active Sessions
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />

        <DropdownMenuItem asChild className="rounded-lg h-9 cursor-pointer text-sm gap-2.5 px-3 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive transition-colors">
          <form action="/admin/logout" method="POST" className="w-full">
            <button type="submit" className="flex items-center gap-2.5 w-full">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
