export {
  parseMetadata,
  parseStringArray,
  stringifyMetadata,
  stringifyStringArray,
} from "@/lib/metadata";

/** Join-table read: ordered string values from child rows. */
export function orderedTagValues<T extends { value: string; sortOrder: number }>(
  rows: T[]
): string[] {
  return [...rows].sort((a, b) => a.sortOrder - b.sortOrder).map((r) => r.value);
}

/** Join-table write: replace-all nested update for ordered child rows. */
export function replaceOrderedChildren(values: string[]) {
  return {
    deleteMany: {},
    create: values.map((value, sortOrder) => ({ value, sortOrder })),
  };
}

/** Stringify named array fields on a record for Prisma write. */
export function stringifyArrayFields<T extends Record<string, unknown>>(
  input: T,
  keys: (keyof T)[]
): T {
  const result = { ...input };
  for (const key of keys) {
    (result as Record<string, unknown>)[key as string] = stringifyStringArray(
      input[key] as string[] | null | undefined
    );
  }
  return result;
}

/** Parse named JSON string-array columns on a Prisma row for API/form use. */
export function parseArrayFields<T extends Record<string, unknown>>(
  row: T,
  keys: (keyof T)[]
): T {
  const result = { ...row };
  for (const key of keys) {
    (result as Record<string, unknown>)[key as string] = parseStringArray(
      row[key] as string | null | undefined
    );
  }
  return result;
}

/** Stringify only array fields that are present on a partial update payload. */
export function stringifyPresentArrayFields<T extends Record<string, unknown>>(
  input: Partial<T>,
  keys: (keyof T)[]
): Partial<T> {
  const result = { ...input };
  for (const key of keys) {
    if (input[key] !== undefined) {
      (result as Record<string, unknown>)[key as string] = stringifyStringArray(
        input[key] as string[] | null | undefined
      );
    }
  }
  return result;
}

/** Join-table write: create nested rows on parent create. */
export function createOrderedChildren(values: string[]) {
  return {
    create: values.map((value, sortOrder) => ({ value, sortOrder })),
  };
}
