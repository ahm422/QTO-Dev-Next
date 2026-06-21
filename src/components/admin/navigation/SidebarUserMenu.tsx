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

interface SidebarUserMenuProps {
  email: string;
  role: string;
}

export default function SidebarUserMenu({ email, role }: SidebarUserMenuProps) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-muted/50 transition-colors rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground leading-none">{email}</p>
            <p className="truncate text-xs text-muted-foreground mt-0.5 capitalize">{role}</p>
          </div>
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-foreground truncate">{email}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
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
