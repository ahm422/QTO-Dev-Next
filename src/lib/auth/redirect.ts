const DEFAULT_ADMIN_PATH = "/admin";

/** Allow only same-origin admin paths; prevents open redirects. */
export function sanitizeAdminRedirect(
  path: string | null | undefined
): string {
  if (!path || typeof path !== "string") {
    return DEFAULT_ADMIN_PATH;
  }

  const trimmed = path.trim();
  if (
    !trimmed.startsWith("/admin") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://") ||
    trimmed.includes("\\")
  ) {
    return DEFAULT_ADMIN_PATH;
  }

  return trimmed;
}
