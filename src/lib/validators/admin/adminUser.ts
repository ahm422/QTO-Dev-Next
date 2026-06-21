import { z } from "zod";
import { ADMIN_ROLES } from "@/lib/auth/roles";
import { validatePasswordStrength } from "@/lib/auth/password";

export const createAdminUserSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Must be a valid email"),
  password: z.string().superRefine((val, ctx) => {
    const error = validatePasswordStrength(val);
    if (error) ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
  }),
  role: z.enum([...ADMIN_ROLES] as [string, ...string[]], { message: "Invalid role" }),
  displayName: z.string().trim().optional(),
});

export const updateAdminUserSchema = z.object({
  role: z.enum([...ADMIN_ROLES] as [string, ...string[]], { message: "Invalid role" }).optional(),
  displayName: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
