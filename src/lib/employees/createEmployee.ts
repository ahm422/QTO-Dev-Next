import { prisma } from "@/lib/prisma";
import type { Employee } from "@prisma/client";
import type { EmployeeInput } from "@/lib/validators/employees/employee";
import { generatePublicId } from "@/lib/employees/publicId";
import { generateEmployeeQr } from "@/lib/employees/qr";

interface CreateEmployeeOptions {
  createdBy?: string | null;
  /** Bulk-import commit (Phase 06) passes true — one digest email replaces N per-row sends. */
  suppressEmail?: boolean;
}

/**
 * Shared employee-creation path used by the admin create API/form (Phase 03)
 * and, later, the bulk-import commit step (Phase 06) — keeping this in one
 * place is what lets suppressEmail be threaded through consistently.
 */
export async function createEmployeeRecord(
  data: EmployeeInput,
  opts: CreateEmployeeOptions = {},
): Promise<Employee> {
  const employee = await prisma.employee.create({
    data: {
      ...data,
      publicId: generatePublicId(),
      createdBy: opts.createdBy ?? null,
    },
  });

  // QR generation must not fail employee creation — generateEmployeeQr never
  // throws; it returns qrKey: null and logs on any failure (see #414 Phase 02).
  const { qrKey } = await generateEmployeeQr(employee.id, employee.publicId);
  const finalEmployee = qrKey
    ? await prisma.employee.update({ where: { id: employee.id }, data: { qrKey } })
    : employee;

  // TODO(#414 Phase 07): send EmployeeWelcomeEmail / HrOnboardingNotice here
  // unless opts.suppressEmail — wired once src/emails/EmployeeWelcomeEmail.tsx
  // and sendReactEmail plumbing for this feature land.
  void opts.suppressEmail;

  return finalEmployee;
}
