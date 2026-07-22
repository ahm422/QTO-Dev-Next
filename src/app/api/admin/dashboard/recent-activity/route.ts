import type { NextRequest } from "next/server"
import { apiSuccess } from "@/lib/apiResponses"
import { requireAdminSession } from "@/lib/api/requireAdminSession"
import { handleRouteError } from "@/lib/api/handleRouteError"
import { getRecentActivity } from "@/lib/admin/recentActivity"

// Live activity feed; never statically cache this route.
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession()
  if (error) return error
  try {
    const rawLimit = request.nextUrl.searchParams.get("limit")
    const limit = rawLimit != null ? Number(rawLimit) : undefined
    return apiSuccess({ items: await getRecentActivity({ limit }) })
  } catch (e) {
    return handleRouteError("GET /api/admin/dashboard/recent-activity", e)
  }
}
