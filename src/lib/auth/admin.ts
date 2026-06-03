import type { Session } from "next-auth";

export const ADMIN_ROLE = "admin" as const;

export function isAdminSession(session: Session | null | undefined): boolean {
  return session?.user?.role === ADMIN_ROLE;
}
