import { prisma } from "@/lib/prisma";
import { generateSecureToken, hashToken } from "./crypto";
import { hashPassword, validatePasswordStrength } from "./password";
import { revokeAllUserTokens } from "./tokens";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function createPasswordResetToken(
  email: string
): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = await generateSecureToken();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.updateMany({
      where: { email, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.create({
      data: { email, tokenHash, expiresAt },
    }),
  ]);

  return { rawToken, expiresAt };
}

export async function validatePasswordResetToken(
  rawToken: string
): Promise<{ valid: boolean }> {
  const tokenHash = await hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  const valid = !!(record && record.usedAt === null && record.expiresAt > new Date());
  return { valid };
}

export async function consumePasswordResetToken(
  rawToken: string,
  newPassword: string
): Promise<{ success: boolean; userId?: string }> {
  const strengthError = validatePasswordStrength(newPassword);
  if (strengthError) return { success: false };

  const tokenHash = await hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt !== null || record.expiresAt < new Date()) {
    return { success: false };
  }

  const user = await prisma.adminUser.findFirst({ where: { email: record.email } });
  if (!user) return { success: false };

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash, passwordChangedAt: new Date() },
    }),
  ]);

  await revokeAllUserTokens(user.id);

  return { success: true, userId: user.id };
}

const RESET_TOKEN_RETENTION_DAYS = 30;

export async function cleanupExpiredPasswordResetTokens(): Promise<number> {
  const retentionCutoff = new Date(
    Date.now() - RESET_TOKEN_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );
  const { count } = await prisma.passwordResetToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() }, usedAt: null },  // expired, never used
        { usedAt: { lt: retentionCutoff } },              // used 30+ days ago
      ],
    },
  });
  return count;
}
