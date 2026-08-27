import QRCode from "qrcode";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { logApiError } from "@/lib/apiResponses";

function buildEmployeeCardUrl(publicId: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, "");
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
