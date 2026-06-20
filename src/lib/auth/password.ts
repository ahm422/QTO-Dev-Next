import { hash, compare } from "bcryptjs";

export const SALT_ROUNDS = 12;

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one digit.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
  return null;
}

export const hashPassword = (plain: string) => hash(plain, SALT_ROUNDS);
export const verifyPassword = (plain: string, hashed: string) => compare(plain, hashed);
