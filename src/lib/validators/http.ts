import { z } from "zod";

export function firstApiFieldError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string
): string | undefined {
  const list = fieldErrors?.[key];
  const msg = list?.[0];
  return typeof msg === "string" && msg.trim() ? msg : undefined;
}

export function formatZodFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key =
      issue.path.length > 0
        ? issue.path.map((p) => String(p)).join(".")
        : "body";
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(issue.message);
  }

  return result;
}

export function asOptionalHeader(value: string | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
