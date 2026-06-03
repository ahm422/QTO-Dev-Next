import { logApiError, mapApiError, apiError } from "@/lib/apiResponses";

export function handleRouteError(route: string, error: unknown) {
  logApiError(route, error);
  const { status, error: msg, details } = mapApiError(error);
  return apiError(status, msg, details);
}
