import QRCode from "qrcode";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { logApiError } from "@/lib/apiResponses";
import { SITE_URL } from "@/lib/constants";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1", "0.0.0.0"]);

/**
 * Canonical public URL baked into an employee's QR PNG. Uses `SITE_URL`
 * (`NEXT_PUBLIC_SITE_URL` with a `https://qtodev.com` fallback) rather than a
 * bare `process.env.X!` — the old non-null assertion is what let
 * `http://localhost:3000` get permanently encoded into prod QR codes (#416).
 * In production a loopback host is a misconfiguration, so throw rather than
 * mint a dead QR.
 */
export function buildEmployeeCardUrl(publicId: string): string {
  const site = SITE_URL.replace(/\/$/, "");
  const host = (() => {
    try {
      return new URL(site).hostname;
    } catch {
      return "";
    }
  })();
  if (process.env.NODE_ENV === "production" && LOOPBACK_HOSTS.has(host)) {
    throw new Error(`Refusing to build an employee QR URL for loopback host "${host}"`);
  }
  return `${site}/employee/${publicId}`;
}

export function buildEmployeeQrKey(employeeId: string): string {
  return `employees/${employeeId}/qr.png`;
}

/**
 * Generates a QR code (PNG) pointing at the employee's public card page and
 * stores it in R2 via the MEDIA binding. Never throws — a QR failure must
 * not block employee creation (see #414 Phase 02): callers get `qrKey: null`
 * on failure and the error is logged.
 */
export async function generateEmployeeQr(
  employeeId: string,
  publicId: string,
): Promise<{ qrKey: string | null }> {
  const key = buildEmployeeQrKey(employeeId);
  try {
    const url = buildEmployeeCardUrl(publicId);
    const png = await QRCode.toBuffer(url, { type: "png", width: 512, margin: 2 });

    const { env } = await getCloudflareContext({ async: true });
    if (!env.MEDIA) {
      throw new Error("MEDIA binding not configured");
    }
    await env.MEDIA.put(key, png, { httpMetadata: { contentType: "image/png" } });

    return { qrKey: key };
  } catch (error) {
    logApiError("employees/qr", error);
    return { qrKey: null };
  }
}
