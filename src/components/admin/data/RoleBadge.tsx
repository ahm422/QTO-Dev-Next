import { cn } from "@/lib/utils";

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  super_admin: { label: "Super Admin", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25" },
  admin:       { label: "Admin",       className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25" },
  editor:      { label: "Editor",      className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25" },
};

export default function RoleBadge({ role, className }: { role: string; className?: string }) {
  const config = ROLE_CONFIG[role] ?? { label: role, className: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", config.className, className)}>
      {config.label}
    </span>
  );
}
