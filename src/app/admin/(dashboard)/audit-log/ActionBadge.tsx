import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Severity = "success" | "warning" | "info" | "destructive" | "default"

const ACTION_SEVERITY: Record<string, Severity> = {
  login_success: "success",
  password_reset_completed: "success",
  login_failed: "warning",
  account_locked: "warning",
  refresh_reuse_detected: "warning",
  token_refresh: "info",
  logout: "info",
  logout_all: "info",
  session_revoked: "info",
  sessions_revoked_others: "info",
  admin_deactivated: "destructive",
  ip_blocked_brute_force: "destructive",
}

const SEVERITY_CLASSES: Record<Severity, string> = {
  success: "bg-emerald-500 text-white border-transparent",
  warning: "bg-amber-500 text-white border-transparent",
  info: "bg-blue-500 text-white border-transparent",
  destructive: "bg-red-500 text-white border-transparent",
  default: "bg-slate-500 text-white border-transparent",
}

export default function ActionBadge({ action }: { readonly action: string }) {
  const severity = ACTION_SEVERITY[action] ?? "default"
  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-xs font-semibold", SEVERITY_CLASSES[severity])}
    >
      {action}
    </Badge>
  )
}
