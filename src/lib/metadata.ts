/**
 * Parse a JSON column stored as text.
 * Returns null for null, undefined, or empty string input.
 * @throws {SyntaxError} when the stored value is non-empty but not valid JSON.
 */
export function parseMetadata<T = Record<string, unknown>>(
  raw: string | null | undefined
): T | null {
  if (raw == null || raw === "") {
    return null;
  }

  return JSON.parse(raw) as T;
}

/**
 * Stringify a value for DB write.
 * Returns null for null or undefined input (use for optional columns).
 */
export function stringifyMetadata(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  return JSON.stringify(value);
}

/** Parse a JSON string array column. Returns [] when stored value is null/empty. */
export function parseStringArray(
  raw: string | null | undefined
): string[] {
  const parsed = parseMetadata<string[]>(raw);
  return parsed ?? [];
}

/** Stringify a string array for DB write. Empty arrays persist as "[]". */
export function stringifyStringArray(value: string[] | null | undefined): string {
  return JSON.stringify(value ?? []);
}
