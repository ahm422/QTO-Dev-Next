import { firstApiFieldError } from "@/lib/validators/http";

export const firstContactFieldError = firstApiFieldError;

export type ContactPostResult =
  | { ok: true }
  | {
      ok: false;
      errorMessage: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function postContactSubmission(
  body: Record<string, unknown>
): Promise<ContactPostResult> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return { ok: true };
    }

    let errorMessage = "Something went wrong. Please try again.";
    let fieldErrors: Record<string, string[]> | undefined;

    try {
      const data = (await response.json()) as {
        error?: string;
        details?: { fieldErrors?: Record<string, string[]>; message?: string };
      };
      if (typeof data.error === "string" && data.error.trim()) {
        errorMessage = data.error.trim();
      }
      if (
        data.details?.fieldErrors &&
        typeof data.details.fieldErrors === "object"
      ) {
        fieldErrors = data.details.fieldErrors;
        const first = Object.values(fieldErrors)
          .flat()
          .find((m) => typeof m === "string" && m.trim());
        if (first?.trim()) {
          errorMessage = first.trim();
        }
      }
      if (
        typeof data.details?.message === "string" &&
        data.details.message.trim()
      ) {
        errorMessage = data.details.message.trim();
      }
    } catch {
      // keep default message
    }

    return { ok: false, errorMessage, fieldErrors };
  } catch {
    return {
      ok: false,
      errorMessage:
        "We could not reach the server. Check your connection and try again.",
    };
  }
}
