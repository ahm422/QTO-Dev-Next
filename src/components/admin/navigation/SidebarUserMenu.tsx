"use client";

import Link from "next/link";
import { Monitor, LogOut, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-rose-500/15 text-rose-500",
  admin: "bg-primary/15 text-primary",
  editor: "bg-emerald-500/15 text-emerald-500",
};

interface SidebarUserMenuProps {
  email: string;
  role: string;
}

export default function SidebarUserMenu({ email, role }: SidebarUserMenuProps) {
  const initials = email.slice(0, 2).toUpperCase();
  const roleColor = ROLE_COLORS[role] ?? "bg-muted text-muted-foreground";
  const roleLabel = role.replace("_", " ");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-accent/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/25 ring-offset-1 ring-offset-[var(--sidebar)]">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground leading-tight">{email}</p>
            <span
              className={`mt-0.5 inline-block rounded-full px-1.5 py-px text-[10px] font-semibold capitalize leading-none ${roleColor}`}
            >
              {roleLabel}
            </span>
          </div>
          <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-56" sideOffset={6}>
        <DropdownMenuLabel className="font-normal py-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate leading-tight">{email}</p>
              <span className={`mt-0.5 inline-block rounded-full px-1.5 py-px text-[10px] font-semibold capitalize leading-none ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/account/sessions" className="flex items-center gap-2 cursor-pointer">
            <Monitor className="h-4 w-4" />
            Active Sessions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action="/admin/logout" method="post" className="w-full">
            <button
              type="submit"
              className="flex items-center gap-2 w-full text-sm text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
