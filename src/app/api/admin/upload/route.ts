import { auth } from "@/auth"
import { apiSuccess, apiError, logApiError } from "@/lib/apiResponses"
import {
  buildMediaKey,
  extensionMatchesMime,
  getPresignedUploadUrl,
  isAllowedMimeType,
  maxBytesForMime,
} from "@/lib/garage"

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== "admin") {
    return apiError(401, "Unauthorized")
  }

  let body: { filename?: string; contentType?: string; fileSize?: number }
  try {
    body = await request.json()
  } catch {
    return apiError(400, "Invalid request body")
  }

  const { filename, contentType, fileSize } = body

  if (!filename || typeof filename !== "string") {
    return apiError(400, "filename is required")
  }

  if (!contentType || typeof contentType !== "string") {
    return apiError(400, "contentType is required")
  }

  if (typeof fileSize !== "number" || !Number.isFinite(fileSize) || fileSize < 0) {
    return apiError(400, "fileSize is required")
  }

  if (!isAllowedMimeType(contentType)) {
    return apiError(
      400,
      "File type not allowed. Use JPEG, PNG, WebP, GIF, MP4, or WebM.",
    )
  }

  if (!extensionMatchesMime(filename, contentType)) {
    return apiError(400, "Filename extension does not match file type")
  }

  const maxBytes = maxBytesForMime(contentType)
  if (fileSize > maxBytes) {
    const limitMb = Math.round(maxBytes / (1024 * 1024))
    return apiError(413, `File exceeds maximum size of ${limitMb} MB`)
  }

  const key = buildMediaKey(filename)

  try {
    const { presignedUrl, publicUrl } = await getPresignedUploadUrl(key, contentType)
    return apiSuccess({ url: publicUrl, presignedUrl })
  } catch (err) {
    logApiError("[upload]", err)
    return apiError(500, "Failed to generate upload URL")
  }
}
