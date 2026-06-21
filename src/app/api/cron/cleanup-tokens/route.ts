import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredTokens } from "@/lib/auth/tokens";
import { cleanupExpiredPasswordResetTokens } from "@/lib/auth/passwordReset";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [deletedRefresh, deletedReset] = await Promise.all([
    cleanupExpiredTokens(),
    cleanupExpiredPasswordResetTokens(),
  ]);

  return NextResponse.json({ deletedRefresh, deletedReset });
}
