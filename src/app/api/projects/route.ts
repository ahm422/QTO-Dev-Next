import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/apiResponses";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { fromPrismaProject, projectWithRelationsInclude } from "@/lib/prisma/projectData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const items = await prisma.project.findMany({
      where: { isPublished: true, ...(category !== undefined && { category }) },
      orderBy: { order: "asc" },
      include: projectWithRelationsInclude,
    });
    return apiSuccess({ items: items.map(fromPrismaProject) });
  } catch (e) {
    return handleRouteError("GET /api/projects", e);
  }
}
