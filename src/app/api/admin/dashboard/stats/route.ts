import { apiSuccess } from "@/lib/apiResponses"
import { requireAdminSession } from "@/lib/api/requireAdminSession"
import { handleRouteError } from "@/lib/api/handleRouteError"
import { getDashboardStats } from "@/lib/admin/dashboardStats"

export async function GET() {
  const { error } = await requireAdminSession()
  if (error) return error
  try {
    return apiSuccess(await getDashboardStats())
  } catch (e) {
    return handleRouteError("GET /api/admin/dashboard/stats", e)
  }
}
