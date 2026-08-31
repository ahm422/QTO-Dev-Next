import { NextRequest } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getPublicCardAssets } from "@/lib/employees/publicCard"
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit"

// Shared, immutable-per-key R2 asset: browser + CDN may hold it, and a
// conditional re-request gets a 304. The key changes whenever the photo is
// replaced, so a long s-maxage is safe.
const CACHE_CONTROL = "public, max-age=300, s-maxage=86400"

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
  const assets = await getPublicCardAssets(publicId)
  if (!assets?.photoKey) {
    return new Response("Not Found", { status: 404 })
  }

  let env: { MEDIA?: R2Bucket }
  try {
    ;({ env } = await getCloudflareContext({ async: true }))
  } catch {
    return new Response("R2 binding unavailable", { status: 503 })
  }
  if (!env.MEDIA) return new Response("MEDIA binding not configured", { status: 503 })

  // `onlyIf: request.headers` lets R2 evaluate If-None-Match itself; on a
  // match it returns an R2Object with no `body`, which we turn into a 304.
  const object = await env.MEDIA.get(assets.photoKey, { onlyIf: request.headers })
  if (!object) return new Response("Not Found", { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  // Guarantee an image/* Content-Type: the site sends `X-Content-Type-Options:
  // nosniff` globally, so a photo streamed without one is blocked by the
  // browser in an <img> (the QR route does the same). Older R2 objects — and
  // objects PUT through the S3-compatible fallback — can come back with no
  // stored contentType.
  if (!headers.get("Content-Type")?.startsWith("image/")) {
    const ext = assets.photoKey.split(".").pop()?.toLowerCase()
    headers.set(
      "Content-Type",
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg",
    )
  }
  headers.set("Cache-Control", CACHE_CONTROL)
  if (object.httpEtag) headers.set("ETag", object.httpEtag)

  if (!("body" in object) || object.body === null) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(object.body as ReadableStream, { status: 200, headers })
}
