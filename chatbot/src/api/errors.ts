import type { Response } from "express";

/**
 * Every error type this API can return. Kept as a flat string union rather than
 * free-form messages so a caller (or a future frontend) can branch on `type`
 * without parsing English text — `message` is the only field meant for display.
 */
export type ApiErrorType =
  | "VALIDATION_ERROR"
  | "MESSAGE_EMPTY"
  | "MESSAGE_TOO_LONG"
  | "MALFORMED_REQUEST"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "SYNC_IN_PROGRESS"
  | "UPSTREAM_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: {
    /** Machine-readable — safe to branch on in code. */
    type: ApiErrorType;
    /** Human-readable — safe to show directly to an end user, no internal detail leaked. */
    message: string;
  };
}

/**
 * Sends a uniform `{ error: { type, message } }` body with the given HTTP status.
 * Every route in this service should use this instead of building its own error
 * shape — see chat.ts, sync.ts, server.ts for the full set of types in use.
 */
export function sendApiError(res: Response, status: number, type: ApiErrorType, message: string): void {
  res.status(status).json({ error: { type, message } } satisfies ApiErrorBody);
}
