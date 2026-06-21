export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILED: "login_failed",
  ACCOUNT_LOCKED: "account_locked",
  LOGOUT: "logout",
  LOGOUT_ALL: "logout_all",
  TOKEN_REFRESH: "token_refresh",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",
  PASSWORD_RESET_COMPLETED: "password_reset_completed",
  ADMIN_CREATED: "admin_created",
  ADMIN_ROLE_CHANGED: "admin_role_changed",
  ADMIN_DEACTIVATED: "admin_deactivated",
  ADMIN_USER_UPDATED: "admin_user_updated",
  ADMIN_USER_FORCE_LOGOUT: "admin_user_force_logout",
  SESSION_REVOKED: "session_revoked",
  SESSIONS_REVOKED_OTHERS: "sessions_revoked_others",
  REFRESH_REUSE_DETECTED: "refresh_reuse_detected",
  IP_BLOCKED_BRUTE_FORCE: "ip_blocked_brute_force",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
