import { Resend } from "resend";
import type { ReactElement } from "react";

/**
 * Singleton Resend client.
 * Resend throws if constructed without a key; use a placeholder so Next.js
 * build can import API routes. Actual sends are gated by isResendConfigured().
 */
export const resend = new Resend(
  process.env.RESEND_API_KEY?.trim() || "re_unconfigured"
);

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendAddresses(): { from: string; adminTo: string } | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const adminTo = process.env.RESEND_TO_EMAIL?.trim();
  if (!from || !adminTo) {
    return null;
  }
  return { from, adminTo };
}

export type SendResendReactEmailInput = {
  from: string;
  to: string;
  subject: string;
  react: ReactElement;
};

export async function sendResendReactEmail(
  input: SendResendReactEmailInput
): Promise<void> {
  if (!isResendConfigured()) {
    return;
  }

  const { data, error } = await resend.emails.send({
    from: input.from,
    to: input.to,
    subject: input.subject,
    react: input.react,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error("Resend send returned no email id");
  }
}
