import { getServerSession } from "@/lib/auth/session";
import { apiError } from "@/lib/apiResponses";

export async function requireAdminSession() {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin")
    return { session: null, error: apiError(401, "Unauthorized") };
  return { session, error: null };
}
