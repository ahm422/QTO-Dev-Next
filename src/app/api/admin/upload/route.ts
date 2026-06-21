import { requireAdminSession } from "@/lib/api/requireAdminSession"
import { apiSuccess, apiError, logApiError } from "@/lib/apiResponses"
import {
  buildMediaKey,
  extensionMatchesMime,
  getPresignedUploadUrl,
  isAllowedMimeType,
  maxBytesForMime,
} from "@/lib/garage"

const MAGIC: Record<string, number[][]> = {
  "image/jpeg":  [[0xFF, 0xD8, 0xFF]],
  "image/png":   [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  "image/gif":   [[0x47, 0x49, 0x46, 0x38]],
  "image/webp":  [[0x52, 0x49, 0x46, 0x46]], // bytes 0-3; bytes 8-11 should be 'W','E','B','P'
  "video/mp4":   [[0x66, 0x74, 0x79, 0x70]], // "ftyp" at offset 4
  "video/webm":  [[0x1A, 0x45, 0xDF, 0xA3]],
}

function validateMagicBytes(buf: ArrayBuffer, mime: string): string | null {
  const bytes = new Uint8Array(buf)
  const signatures = MAGIC[mime]
  if (!signatures) return null // unknown — skip validation
  for (const sig of signatures) {
    const offset = mime === "video/mp4" ? 4 : 0
    if (sig.every((b, i) => bytes[offset + i] === b)) return null
    // WebP extra check: RIFF header + WEBP marker at offset 8
    if (mime === "image/webp") {
      const webp = [0x57, 0x45, 0x42, 0x50]
      if (sig.every((b, i) => bytes[i] === b) && webp.every((b, i) => bytes[8 + i] === b)) return null
    }
  }
  return `File content does not match declared type (${mime}). Upload rejected.`
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession()
  if (error) return error

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

    // Magic-byte validation: verify declared MIME matches actual file signature
    const magicError = validateMagicBytes(fileBytes, contentType)
    if (magicError) return apiError(400, magicError)

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
