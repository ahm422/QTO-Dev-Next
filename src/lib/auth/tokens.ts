import { prisma } from "@/lib/prisma";
import { generateSecureToken, hashToken } from "./crypto";
import { REFRESH_TOKEN_EXPIRY } from "./constants";

// Revoked tokens are retained for this many days before hard-deletion (audit trail).
const REVOKED_TOKEN_RETENTION_DAYS = 30;

export async function createRefreshToken(
  userId: string,
  ip?: string,
  userAgent?: string
): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = await generateSecureToken();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash, userId, ip, userAgent, expiresAt },
  });

  return { rawToken, expiresAt };
}

export async function verifyAndRotateRefreshToken(
  rawToken: string
): Promise<{ userId: string; rawToken: string; expiresAt: Date } | null> {
  const tokenHash = await hashToken(rawToken);

  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing || existing.revokedAt !== null || existing.expiresAt < new Date()) {
    return null;
  }

  const newRaw = await generateSecureToken();
  const newHash = await hashToken(newRaw);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000);
  const now = new Date();

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: now, lastUsedAt: now },
    }),
    prisma.refreshToken.create({
      data: {
        tokenHash: newHash,
        userId: existing.userId,
        ip: existing.ip,
        userAgent: existing.userAgent,
        expiresAt,
      },
    }),
  ]);

  return { userId: existing.userId, rawToken: newRaw, expiresAt };
}

export async function revokeRefreshToken(rawToken: string): Promise<boolean> {
  const tokenHash = await hashToken(rawToken);

  const updated = await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return updated.count > 0;
}

export async function revokeAllUserTokens(userId: string): Promise<number> {
  const result = await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count;
}

export async function listActiveSessionsForUser(userId: string) {
  return prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      ip: true,
      userAgent: true,
      createdAt: true,
      lastUsedAt: true,
      expiresAt: true,
    },
    orderBy: { lastUsedAt: "desc" },
  });
}

export async function getCurrentSessionId(rawToken: string): Promise<string | null> {
  const tokenHash = await hashToken(rawToken);
  const row = await prisma.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    select: { id: true },
  });
  return row?.id ?? null;
}

export async function revokeSessionById(userId: string, sessionId: string): Promise<boolean> {
  const result = await prisma.refreshToken.updateMany({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { revokedAt: new Date() },
  });
  return result.count > 0;
}

export async function revokeAllSessionsExcept(userId: string, rawToken: string): Promise<number> {
  const currentId = await getCurrentSessionId(rawToken);
  const result = await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      ...(currentId ? { id: { not: currentId } } : {}),
    },
    data: { revokedAt: new Date() },
  });
  return result.count;
}

export async function cleanupExpiredTokens(): Promise<number> {
  const retentionCutoff = new Date(
    Date.now() - REVOKED_TOKEN_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );

  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() }, revokedAt: null },
        { revokedAt: { lt: retentionCutoff } },
      ],
    },
  });

  return result.count;
}
