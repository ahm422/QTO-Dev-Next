import { auth } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function SidebarUserProfile() {
  const session = await auth()
  const name = session?.user?.name ?? "Admin"
  const email = session?.user?.email ?? ""
  const image = session?.user?.image ?? ""
  const role = (session?.user as { role?: string })?.role ?? "admin"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground leading-none">{name}</p>
        <p className="truncate text-xs text-muted-foreground mt-0.5 capitalize">{role}</p>
      </div>
    </div>
  )
}
