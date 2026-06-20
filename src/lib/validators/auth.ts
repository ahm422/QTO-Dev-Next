import { z } from "zod";
import { requiredTrimmedString } from "@/lib/validators/shared";
import { validatePasswordStrength } from "@/lib/auth/password";

export const loginSchema = z.object({
  email: requiredTrimmedString("Email is required").pipe(
    z.string().email("Email must be a valid email address")
  ),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: requiredTrimmedString("Email is required").pipe(
    z.string().email("Email must be a valid email address")
  ),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().superRefine((val, ctx) => {
    const error = validatePasswordStrength(val);
    if (error) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
    }
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
