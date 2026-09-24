import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/apiResponses";
import { formatZodFieldErrors } from "@/lib/validators/http";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { parseJsonBody } from "@/lib/api/parseJsonBody";
import { handleRouteError } from "@/lib/api/handleRouteError";
import { processStepSchema } from "@/lib/validators/admin/processStep";
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync";

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    const items = await prisma.processStep.findMany({
      where: context ? { context } : undefined,
      orderBy: [{ context: "asc" }, { order: "asc" }],
    });
    return apiSuccess({ items });
  } catch (e) {
    return handleRouteError("GET /api/admin/process-steps", e);
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "admin"] });
  if (error) return error;
  const { body, error: bodyError } = await parseJsonBody(request);
  if (bodyError) return bodyError;
  const parsed = processStepSchema.safeParse(body);
  if (!parsed.success)
    return apiError(400, "Validation failed", { fieldErrors: formatZodFieldErrors(parsed.error) });
  try {
    const item = await prisma.processStep.create({ data: parsed.data });
    revalidatePath("/");
    revalidatePath("/services");
    triggerChatbotSync("process_steps");
    return apiSuccess({ id: item.id }, 201);
  } catch (e) {
    return handleRouteError("POST /api/admin/process-steps", e);
  }
}
