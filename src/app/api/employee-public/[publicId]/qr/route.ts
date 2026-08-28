import { NextRequest } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getPublicEmployeeCard } from "@/lib/employees/publicCard"
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit"

/**
 * Streams an employee's QR PNG from R2 without exposing the underlying key or
 * a raw R2 URL to the client (#416) — mirrors the photo route: key resolved
 * server-side from publicId, same not-found parity as the card page, so a
 * terminated employee's QR 404s the same as an unknown one.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> },
) {
  const rateLimit = await checkRateLimit({
    request,
    routeKey: "employee-public-qr",
    config: { limit: 30, windowSeconds: 300 },
  })
  if (!rateLimit.allowed) return rateLimitExceededResponse(rateLimit.retryAfterSeconds)

  const { publicId } = await params
  const card = await getPublicEmployeeCard(publicId)
  if (!card?.qrKey) {
    return new Response("Not Found", { status: 404 })
  }

  let env: { MEDIA?: R2Bucket }
  try {
    ;({ env } = await getCloudflareContext({ async: true }))
  } catch {
    return new Response("R2 binding unavailable", { status: 503 })
  }
  if (!env.MEDIA) return new Response("MEDIA binding not configured", { status: 503 })

  const object = await env.MEDIA.get(card.qrKey)
  if (!object) return new Response("Not Found", { status: 404 })

  const headers = new Headers()
  headers.set("Content-Type", object.httpMetadata?.contentType ?? "image/png")
  headers.set("Cache-Control", "private, max-age=300")

  return new Response(object.body as ReadableStream, { status: 200, headers })
}
