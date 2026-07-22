import { prisma } from "@/lib/prisma";
import { stringifyMetadata } from "@/lib/metadata";
import type { AuditAction } from "@/lib/auth/auditActions";
import type { ServerSession } from "@/lib/auth/session";

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

interface ContentAuditInput {
  session: ServerSession;
  action: AuditAction;
  section: string;
  entityId: string;
  label?: string | null;
}

/**
 * Record a content mutation (create/update/delete/publish) for the recent-activity feed.
 * Best-effort: delegates to writeAuditLog, which never throws.
 */
export async function writeContentAudit(input: ContentAuditInput): Promise<void> {
  await writeAuditLog({
    userId: input.session.user.id,
    action: input.action,
    metadata: {
      section: input.section,
      entityId: input.entityId,
      label: input.label ?? null,
    },
  });
}
