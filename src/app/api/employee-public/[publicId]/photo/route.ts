import { NextRequest } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getPublicEmployeeCard } from "@/lib/employees/publicCard"
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit"

/**
 * Streams an employee's photo from R2 without ever exposing the underlying
 * key or a raw R2 URL to the client (#414 Phase 04) — the key is resolved
 * server-side from publicId, same not-found parity as the card page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> },
) {
  const rateLimit = await checkRateLimit({
    request,
    routeKey: "employee-public-photo",
    config: { limit: 30, windowSeconds: 300 },
  })
  if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit.retryAfterSeconds)

  const { publicId } = await params
  const card = await getPublicEmployeeCard(publicId)
  if (!card?.photoKey) {
    return new Response("Not Found", { status: 404 })
  }

  let env: { MEDIA?: R2Bucket }
  try {
    ;({ env } = await getCloudflareContext({ async: true }))
  } catch {
    return new Response("R2 binding unavailable", { status: 503 })
  }
  if (!env.MEDIA) return new Response("MEDIA binding not configured", { status: 503 })

  const object = await env.MEDIA.get(card.photoKey)
  if (!object) return new Response("Not Found", { status: 404 })

  const headers = new Headers()
  if (object.httpMetadata?.contentType) {
    headers.set("Content-Type", object.httpMetadata.contentType)
  }
  headers.set("Cache-Control", "private, max-age=300")

  return new Response(object.body as ReadableStream, { status: 200, headers })
}
