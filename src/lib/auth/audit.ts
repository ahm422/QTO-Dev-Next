import { prisma } from "@/lib/prisma";
import { stringifyMetadata } from "@/lib/metadata";
import type { AuditAction } from "@/lib/auth/auditActions";

interface AuditLogInput {
  userId?: string | null;
  email?: string | null;
  action: AuditAction | string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        email: input.email ?? null,
        action: input.action,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        metadata: stringifyMetadata(input.metadata),
      },
    });
  } catch (err) {
    console.error("[audit] Failed to write audit log", { action: input.action, err });
  }
}
