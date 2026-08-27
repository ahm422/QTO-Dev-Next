import { requireAdminSession } from "@/lib/api/requireAdminSession"
import { apiSuccess, apiError, logApiError } from "@/lib/apiResponses"
import {
  ALLOWED_IMAGE_MIMES,
  extensionMatchesMime,
  isAllowedMimeType,
  sanitizeFilename,
  uploadMediaObject,
} from "@/lib/garage"

// Employee photos back an unauthenticated public card page (Phase 04), which
// must never emit a raw R2 URL for this field — only image types, 5MB cap,
// tighter than the generic /api/admin/upload's 10MB image ceiling.
const MAX_PHOTO_BYTES = 5 * 1024 * 1024

export async function POST(request: Request) {
  const { error } = await requireAdminSession({ allowedRoles: ["super_admin", "hr"] })
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

  if (!isAllowedMimeType(contentType) || !(ALLOWED_IMAGE_MIMES as readonly string[]).includes(contentType)) {
    return apiError(400, "File type not allowed. Use JPEG, PNG, or WebP.")
  }
  if (!extensionMatchesMime(filename, contentType)) {
    return apiError(400, "Filename extension does not match file type")
  }
  if (fileSize > MAX_PHOTO_BYTES) {
    return apiError(413, "File exceeds maximum size of 5 MB")
  }

  const key = `employees/photos/${crypto.randomUUID()}/${sanitizeFilename(filename)}`

  try {
    const fileBytes = await file.arrayBuffer()
    const { publicUrl } = await uploadMediaObject(key, contentType, fileBytes)
    // `publicUrl` here is only used for the admin-side live preview — the
    // public card page resolves photos through its own proxy route instead.
    return apiSuccess({ key, url: publicUrl })
  } catch (err) {
    logApiError("employees/photo", err)
    return apiError(500, "Upload failed")
  }
}
