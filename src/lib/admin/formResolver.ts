import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

/** Bridges Zod input/output types with react-hook-form (admin CMS forms). */
export function formResolver<T extends FieldValues>(schema: ZodType<T>): Resolver<T> {
  return zodResolver(schema) as Resolver<T>;
}
