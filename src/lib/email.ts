import { render } from "@react-email/render";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ReactElement } from "react";
import { SITE_NAME } from "@/lib/constants";

/** Sync gate: skip sends when EMAIL_FROM is not wired (no API key — binding replaces it). */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_FROM?.trim());
}

export function getEmailFromAddress(): string | null {
  return process.env.EMAIL_FROM?.trim() ?? null;
}

export function getEmailAddresses(): { from: string; adminTo: string } | null {
  const from = process.env.EMAIL_FROM?.trim();
  const adminTo = process.env.EMAIL_ADMIN_TO?.trim();
  if (!from || !adminTo) {
    return null;
  }
  return { from, adminTo };
}

export type SendReactEmailInput = {
  from: string;
  to: string;
  subject: string;
  react: ReactElement;
  /** When set, Reply goes here instead of the from-address. */
  replyTo?: string;
};

function formatSendError(error: unknown): Error {
  if (error && typeof error === "object" && "message" in error) {
    const code =
      "code" in error && typeof (error as { code: unknown }).code === "string"
        ? (error as { code: string }).code
        : undefined;
    const message = String((error as { message: unknown }).message);
    return new Error(code ? `${code}: ${message}` : message);
  }
  return error instanceof Error ? error : new Error(String(error));
}

/**
 * Render a React Email component and send via the Cloudflare Email Service binding.
 * No-ops when EMAIL_FROM is unset; throws on send failure so call sites can logApiError.
 */
export async function sendReactEmail(input: SendReactEmailInput): Promise<void> {
  if (!isEmailConfigured()) {
    return;
  }

  const [html, text] = await Promise.all([
    render(input.react),
    render(input.react, { plainText: true }),
  ]);

  const { env } = await getCloudflareContext({ async: true });
  if (!env.EMAIL) {
    throw new Error("EMAIL binding is not configured");
  }

  try {
    await env.EMAIL.send({
      to: input.to,
      from: { email: input.from, name: SITE_NAME },
      subject: input.subject,
      html,
      text,
      ...(input.replyTo?.trim()
        ? { replyTo: input.replyTo.trim() }
        : {}),
    });
  } catch (error) {
    throw formatSendError(error);
  }
}
