import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { COOKIE_ACCESS_TOKEN } from "./constants";

export interface ServerSession {
  user: { id: string; email: string; role: string };
}

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  return { user: { id: payload.sub, email: payload.email, role: payload.role } };
}
