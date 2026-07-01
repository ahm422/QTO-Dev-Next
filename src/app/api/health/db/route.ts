import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/apiResponses";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return apiSuccess({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database check failed";
    return apiError(503, message);
  }
}
