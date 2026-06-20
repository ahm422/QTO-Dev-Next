import { cookies, headers } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { COOKIE_ACCESS_TOKEN } from "./constants";

export interface ServerSession {
  user: { id: string; email: string; role: string };
}

export async function getServerSession(): Promise<ServerSession | null> {
  // Fast path: middleware already verified the token and forwarded user identity
  const h = await headers();
  const userId = h.get("x-user-id");
  const email = h.get("x-user-email");
  const role = h.get("x-user-role");
  if (userId && email && role) {
    return { user: { id: userId, email, role } };
  }

  // Fallback: verify cookie directly (API routes, pages not behind middleware)
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  return { user: { id: payload.sub, email: payload.email, role: payload.role } };
}
