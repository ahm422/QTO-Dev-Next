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

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return apiError(400, "Invalid request body")
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return apiError(400, "file is required")
  }

  const { name: filename, type: contentType, size: fileSize } = file

  if (!isAllowedMimeType(contentType)) {
    return apiError(400, "File type not allowed. Use JPEG, PNG, WebP, GIF, MP4, or WebM.")
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
    // Generate presigned URL then PUT from server — avoids browser CORS entirely
    const { presignedUrl, publicUrl } = await getPresignedUploadUrl(key, contentType)
    const fileBytes = await file.arrayBuffer()

    const putRes = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: fileBytes,
    })

    if (!putRes.ok) {
      throw new Error(`Storage PUT failed with status ${putRes.status}`)
    }

    return apiSuccess({ url: publicUrl })
  } catch (err) {
    logApiError("[upload]", err)
    return apiError(500, "Upload failed")
  }
}
