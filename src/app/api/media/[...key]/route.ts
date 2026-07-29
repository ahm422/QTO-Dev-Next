import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Dev-only proxy: serves objects from the local R2 binding so that
 * `getPublicUrl()` works without a reachable remote r2.dev domain.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params
  const objectKey = key.join("/")

  let env: { MEDIA?: R2Bucket }
  try {
    ;({ env } = await getCloudflareContext({ async: true }))
  } catch {
    return new Response("R2 binding unavailable", { status: 503 })
  }

  if (!env.MEDIA) {
    return new Response("MEDIA binding not configured", { status: 503 })
  }

  const object = await env.MEDIA.get(objectKey)
  if (!object) {
    return new Response("Not Found", { status: 404 })
  }

  const headers = new Headers()
  if (object.httpMetadata?.contentType) {
    headers.set("Content-Type", object.httpMetadata.contentType)
  }
  headers.set("Cache-Control", "public, max-age=31536000, immutable")

  return new Response(object.body as ReadableStream, { status: 200, headers })
}
