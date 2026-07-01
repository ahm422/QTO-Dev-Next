import {
  stringifyMetadata,
  stringifyStringArray,
} from "../../src/lib/metadata";
import { createOrderedChildren } from "../../src/lib/prisma/arrayFields";

export { stringifyMetadata, stringifyStringArray, createOrderedChildren };

/** Build join-table create payload with explicit parent id preserved. */
export function arrayToJoinRows(
  parentId: string,
  parentIdField: string,
  values: string[]
) {
  return values.map((value, sortOrder) => ({
    id: crypto.randomUUID(),
    [parentIdField]: parentId,
    value,
    sortOrder,
  }));
}

export function jsonToString(value: unknown, fallback = "{}"): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Pick N random items from an array (or all if fewer than N). */
export function sampleIds<T extends { id: string }>(rows: T[], n: number): string[] {
  if (rows.length <= n) return rows.map((r) => r.id);
  const shuffled = [...rows].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((r) => r.id);
}
