/**
 * Uploads a single image File to the shared admin upload route and returns its
 * public URL. Same endpoint and `file` field that `MediaUpload` uses
 * (`src/app/api/admin/upload/route.ts`); the response shape is
 * `{ success, details: { url } }` / `{ success: false, error }` from
 * `src/lib/apiResponses.ts`.
 */
export async function uploadEditorImage(file: File): Promise<string> {
  const body = new FormData()
  body.append("file", file)

  const res = await fetch("/api/admin/upload", { method: "POST", body })

  let json: { success?: boolean; error?: string; details?: { url?: string } }
  try {
    json = await res.json()
  } catch {
    throw new Error(`Upload failed (${res.status})`)
  }

  if (!res.ok || !json.success || !json.details?.url) {
    throw new Error(json.error || `Upload failed (${res.status})`)
  }
  return json.details.url
}
