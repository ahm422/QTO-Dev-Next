import { getServerSession } from "@/lib/auth/session"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function SidebarUserProfile() {
  const session = await getServerSession()
  const email = session?.user?.email ?? ""
  const role = session?.user?.role ?? "admin"
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground leading-none">{email}</p>
        <p className="truncate text-xs text-muted-foreground mt-0.5 capitalize">{role}</p>
      </div>
    </div>
  )
}
