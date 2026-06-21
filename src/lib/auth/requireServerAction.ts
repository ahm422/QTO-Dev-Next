import { getServerSession } from "@/lib/auth/session";
import type { AdminRole } from "@/lib/auth/roles";

const ALL_ROLES: AdminRole[] = ["super_admin", "admin", "editor"];

export async function requireServerAction(allowedRoles: AdminRole[] = ALL_ROLES) {
  const session = await getServerSession();
  if (!session || !allowedRoles.includes(session.user.role as AdminRole)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export const requireAdminAction = () => requireServerAction();
export const requireDeleteAction = () => requireServerAction(["super_admin", "admin"]);
