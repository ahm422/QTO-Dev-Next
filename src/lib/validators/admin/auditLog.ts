import { z } from "zod";

export const auditLogQuerySchema = z.object({
  action: z.string().optional(),
  userId: z.string().uuid().optional(),
  email: z.string().optional(),
  q: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
