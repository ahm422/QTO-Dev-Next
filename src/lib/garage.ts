// Presigned S3 PUT URL generator using Web Crypto (SubtleCrypto).
// Avoids @aws-sdk which imports the Node.js 'crypto' module — incompatible with
// Next.js edge / Cloudflare Workers runtime.

const enc = new TextEncoder()

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

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
): Promise<{ presignedUrl: string; publicUrl: string }> {
  const endpoint = process.env.GARAGE_ENDPOINT!
  const accessKeyId = process.env.GARAGE_ACCESS_KEY_ID!
  const secretAccessKey = process.env.GARAGE_SECRET_ACCESS_KEY!
  const bucket = process.env.GARAGE_BUCKET_NAME!
  const publicBase = process.env.GARAGE_PUBLIC_URL!

  const region = "garage"
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
  const publicUrl = `${publicBase}/${key}`

  return { presignedUrl, publicUrl }
}
