import { z } from "zod";

const toTrimmedString = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const requiredTrimmedString = (message: string) =>
  z.preprocess(toTrimmedString, z.string().min(1, message));

export const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().optional());

export const jsonValueSchema: z.ZodType<
  string | number | boolean | null | { [key: string]: unknown } | unknown[]
> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ])
);

export const metadataSchema = z.record(z.string(), jsonValueSchema).optional();
