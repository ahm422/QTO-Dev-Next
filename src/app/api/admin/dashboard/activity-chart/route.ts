import type { NextRequest } from "next/server"
import { apiSuccess } from "@/lib/apiResponses"
import { requireAdminSession } from "@/lib/api/requireAdminSession"
import { handleRouteError } from "@/lib/api/handleRouteError"
import { getActivityChart, type ActivityRange } from "@/lib/admin/activityChart"

// Counts are derived from live DB state, so never statically cache this route.
export const dynamic = "force-dynamic"

function parseRange(raw: string | null): ActivityRange {
  return raw === "1y" ? "1y" : "6m"
}

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession()
  if (error) return error
  try {
    const params = request.nextUrl.searchParams
    const range = parseRange(params.get("range"))
    const metricKeys = (params.get("metrics") ?? "").split(",").map((k) => k.trim()).filter(Boolean)
    return apiSuccess(await getActivityChart({ range, metricKeys }))
  } catch (e) {
    return handleRouteError("GET /api/admin/dashboard/activity-chart", e)
  }
}
