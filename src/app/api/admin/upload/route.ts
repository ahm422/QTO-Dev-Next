import { auth } from "@/auth"
import { apiSuccess, apiError } from "@/lib/apiResponses"
import { getPresignedUploadUrl } from "@/lib/garage"

const ALLOWED_MIME_PREFIXES = ["image/", "video/"]
const MAX_FILENAME_LENGTH = 255

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, MAX_FILENAME_LENGTH)
}

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user?.role !== "admin") {
    return apiError(401, "Unauthorized")
  }

  let body: { filename?: string; contentType?: string }
  try {
    body = await request.json()
  } catch {
    return apiError(400, "Invalid request body")
  }

  const { filename, contentType } = body

  if (!filename || typeof filename !== "string") {
    return apiError(400, "filename is required")
  }

  if (!contentType || typeof contentType !== "string") {
    return apiError(400, "contentType is required")
  }

  const isAllowed = ALLOWED_MIME_PREFIXES.some((prefix) => contentType.startsWith(prefix))
  if (!isAllowed) {
    return apiError(400, "Only image and video uploads are allowed")
  }

  const key = `admin/${crypto.randomUUID()}-${sanitizeFilename(filename)}`

  try {
    const result = await getPresignedUploadUrl(key, contentType)
    return apiSuccess(result)
  } catch (err) {
    console.error("[upload] presign error", err)
    return apiError(500, "Failed to generate upload URL")
  }
}
