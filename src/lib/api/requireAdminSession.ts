import { auth } from "@/auth";
import { isAdminSession } from "@/lib/auth/admin";
import { apiError } from "@/lib/apiResponses";

export async function requireAdminSession() {
  const session = await auth();
  if (!isAdminSession(session))
    return { session: null, error: apiError(401, "Unauthorized") };
  return { session, error: null };
}
