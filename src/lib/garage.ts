// Presigned S3 PUT URL generator using Web Crypto (SubtleCrypto).
// Avoids @aws-sdk which imports the Node.js 'crypto' module — incompatible with
// Next.js edge / Cloudflare Workers runtime.

const enc = new TextEncoder()
const MAX_FILENAME_LENGTH = 255

export const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const

export const ALLOWED_VIDEO_MIMES = ["video/mp4", "video/webm"] as const

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIMES,
  ...ALLOWED_VIDEO_MIMES,
] as const

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024

const EXT_BY_MIME: Record<AllowedMimeType, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
}

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name
  return base
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, MAX_FILENAME_LENGTH)
}

export function buildMediaKey(filename: string): string {
  return `media/${crypto.randomUUID()}/${sanitizeFilename(filename)}`
}

export function getPublicUrl(key: string): string {
  const publicBase = process.env.R2_PUBLIC_URL!.replace(/\/$/, "")
  return `${publicBase}/${key}`
}

export function isAllowedMimeType(contentType: string): contentType is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(contentType)
}

export function maxBytesForMime(contentType: AllowedMimeType): number {
  return (ALLOWED_IMAGE_MIMES as readonly string[]).includes(contentType)
    ? MAX_IMAGE_BYTES
    : MAX_VIDEO_BYTES
}

export function extensionMatchesMime(filename: string, contentType: AllowedMimeType): boolean {
  const match = filename.toLowerCase().match(/\.[^.]+$/)
  const ext = match?.[0] ?? ""
  return EXT_BY_MIME[contentType].includes(ext)
}

async function hmacSHA256(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  return crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data))
}

async function sha256Hex(data: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(data))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const kSecret = enc.encode("AWS4" + secretKey)
  const kDate = await hmacSHA256(kSecret.buffer as ArrayBuffer, dateStamp)
  const kRegion = await hmacSHA256(kDate, region)
  const kService = await hmacSHA256(kRegion, service)
  return hmacSHA256(kService, "aws4_request")
}

/** Normalize dashboard-copied endpoint (may include /bucket suffix) to S3 API base URL. */
function normalizeR2S3Endpoint(raw: string, bucket: string): string {
  const trimmed = raw.replace(/\/$/, "");
  const bucketSuffix = `/${bucket}`;
  return trimmed.endsWith(bucketSuffix) ? trimmed.slice(0, -bucketSuffix.length) : trimmed;
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
): Promise<{ presignedUrl: string; publicUrl: string }> {
  const bucket = process.env.R2_BUCKET_NAME ?? "qtodev-media";
  const endpoint = normalizeR2S3Endpoint(process.env.R2_S3_ENDPOINT!, bucket);
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;

  const region = process.env.R2_REGION ?? "auto"
  const service = "s3"
  const expiresIn = 300

  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z"
  const dateStamp = amzDate.slice(0, 8)

  const endpointUrl = new URL(endpoint)
  const host = endpointUrl.host

  // Path-style: /<bucket>/<key>
  const canonicalUri = `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, "/")}`

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const credential = `${accessKeyId}/${credentialScope}`

  const queryParams = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": credential,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": "content-type;host",
  })
  queryParams.sort()
  const canonicalQueryString = queryParams.toString()

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`
  const signedHeaders = "content-type;host"

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n")

  const hashedCanonicalRequest = await sha256Hex(canonicalRequest)

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashedCanonicalRequest,
  ].join("\n")

  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service)
  const signatureBuf = await hmacSHA256(signingKey, stringToSign)
  const signature = toHex(signatureBuf)

  queryParams.append("X-Amz-Signature", signature)

  const presignedUrl = `${endpoint}/${bucket}/${key}?${queryParams.toString()}`
  const publicUrl = getPublicUrl(key)

  return { presignedUrl, publicUrl }
}
