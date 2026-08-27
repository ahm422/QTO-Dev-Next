import { prisma } from "@/lib/prisma";
import type { Employee } from "@prisma/client";
import { jsx } from "react/jsx-runtime";
import type { EmployeeInput } from "@/lib/validators/employees/employee";
import { generatePublicId } from "@/lib/employees/publicId";
import { generateEmployeeQr } from "@/lib/employees/qr";
import { isEmailConfigured, getEmailAddresses, sendReactEmail } from "@/lib/email";
import { logApiError } from "@/lib/apiResponses";
import { SITE_URL } from "@/lib/constants";
import EmployeeWelcomeEmail from "@/emails/EmployeeWelcomeEmail";
import HrOnboardingNotice from "@/emails/HrOnboardingNotice";

interface CreateEmployeeOptions {
  createdBy?: string | null;
  /** Skip the welcome/HR-notice emails for this creation (e.g. scripted/seed creates). */
  suppressEmail?: boolean;
}

async function sendOnboardingEmails(employee: Employee, createdBy?: string | null) {
  if (!isEmailConfigured()) return;
  const addresses = getEmailAddresses();
  if (!addresses) return;
  const { from, adminTo } = addresses;

  const cardUrl = `${SITE_URL}/employee/${employee.publicId}`;
  const adminUrl = `${SITE_URL}/admin/employees/${employee.id}`;

  const sends: Promise<void>[] = [];

  if (employee.email) {
    sends.push(
      sendReactEmail({
        from,
        to: employee.email,
        replyTo: adminTo,
        subject: `Welcome, ${employee.name}!`,
        react: jsx(EmployeeWelcomeEmail, {
          name: employee.name,
          employeeCode: employee.employeeCode,
          designation: employee.designation,
          department: employee.department,
          cardUrl,
        }),
      }).catch((err) => logApiError("employees/create:welcome-email", err)),
    );
  }

  const creator = createdBy
    ? await prisma.adminUser.findUnique({ where: { id: createdBy }, select: { email: true } })
    : null;

  sends.push(
    sendReactEmail({
      from,
      to: adminTo,
      subject: `New employee: ${employee.name}`,
      react: jsx(HrOnboardingNotice, {
        name: employee.name,
        employeeCode: employee.employeeCode,
        department: employee.department,
        createdByEmail: creator?.email,
        adminUrl,
      }),
    }).catch((err) => logApiError("employees/create:hr-notice-email", err)),
  );

  await Promise.allSettled(sends);
}

/**
 * Shared employee-creation path used by both the admin create API route and
 * the dashboard's createEmployee server action — one place to generate the
 * publicId/QR and fire onboarding emails consistently.
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

  if (!opts.suppressEmail) {
    await sendOnboardingEmails(finalEmployee, opts.createdBy);
  }

  return finalEmployee;
}
