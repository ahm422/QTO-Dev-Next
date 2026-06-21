export const ADMIN_ROLES = ["super_admin", "admin", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(v: string): v is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(v);
}

export function roleCanManageUsers(role: AdminRole): boolean {
  return role === "super_admin";
}

export function roleCanCreateContent(role: AdminRole): boolean {
  return role === "super_admin" || role === "admin";
}

export function roleCanDeleteContent(role: AdminRole): boolean {
  return role === "super_admin" || role === "admin";
}
