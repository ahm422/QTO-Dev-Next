import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context") ?? undefined;
    const items = await prisma.faq.findMany({
      where: { isPublished: true, ...(context !== undefined && { context }) },
      orderBy: [{ context: "asc" }, { order: "asc" }],
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/faqs", e);
  }
}
