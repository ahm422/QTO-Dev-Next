import { getServerSession } from "@/lib/auth/session";
import { apiError } from "@/lib/apiResponses";
import type { AdminRole } from "@/lib/auth/roles";

const ALL_ROLES: AdminRole[] = ["super_admin", "admin", "editor"];

export async function requireAdminSession(opts?: { allowedRoles?: AdminRole[] }) {
  const session = await getServerSession();
  const allowed = opts?.allowedRoles ?? ALL_ROLES;
  if (!session || !allowed.includes(session.user.role as AdminRole))
    return { session: null, error: apiError(401, "Unauthorized") };
  return { session, error: null };
}
