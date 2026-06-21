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
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  default: "bg-muted text-muted-foreground border-border",
}

export default function ActionBadge({ action }: { action: string }) {
  const severity = ACTION_SEVERITY[action] ?? "default"
  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-xs", SEVERITY_CLASSES[severity])}
    >
      {action}
    </Badge>
  )
}
