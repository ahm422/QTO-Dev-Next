import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  super_admin: { label: "Super Admin", className: "bg-rose-600 text-white" },
  admin:       { label: "Admin",       className: "bg-orange-500 text-white" },
  editor:      { label: "Editor",      className: "bg-emerald-600 text-white" },
};

type RoleBadgeSize = "xs" | "sm" | "default";

const sizeStyles: Record<RoleBadgeSize, string> = {
  xs: "rounded-full px-1.5 py-px text-[10px] font-semibold leading-none",
  sm: "rounded-full px-2 py-0.5 text-[11px] font-medium",
  default: "rounded-full px-2.5 py-0.5 text-xs font-medium",
};

export default function RoleBadge({
  role,
  size = "default",
  className,
}: {
  role: string;
  size?: RoleBadgeSize;
  className?: string;
}) {
  const config = ROLE_CONFIG[role] ?? { label: role, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center", sizeStyles[size], config.className, className)}>
      {config.label}
    </span>
  );
}
